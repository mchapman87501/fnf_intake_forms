// This is a *really* basic user registration / authentication database.
// It uses simple-json-db for its persistent, key-value store.
// It probably isn't multi-thread safe.

// Implementation aspirations:
// * "Secrets" are provided by vite env mgmt -- i.e., they are imported from
//   a .env file, which must not be stored under revision control.
// * The location of the database is specified by the USER_DB_PATH secret.
// * Account records include a username and hashed password.
//   - The password is hashed using bcrypt (https://www.npmjs.com/package/bcrypt)
// * A la Django, one admin account is created by default.
//   - Its username and password are specified by two secrets: ADMIN_USERNAME, ADMIN_PASSWORD.
// * Each account record has an associated list of roles.
//   - For the admin account: ["admin"]
//   - Clients can use roles to determine what actions an account may perform.
// * Each account can have an associated refresh token.
//   - Clients can add and remove refresh tokens as needed.

import JSONDB from 'simple-json-db'
import bcrypt from 'bcrypt'
import path from 'path'
import fsPromises from 'fs/promises'

import { newRefreshToken } from './tokens.server'

// Fragile: must invoke initUserDB before invoking any other exported functions.
let db: JSONDB

class UserRecord {
	username: string
	password: string // Hashed!
	roles: string[]
	refreshToken: string

	constructor(username: string, password: string, roles: string[] = [], refreshToken: string = '') {
		this.username = username
		this.password = password
		this.roles = roles
		this.refreshToken = refreshToken
	}

	static fromDBObj(rec: any): UserRecord | null {
		try {
			if (!rec) {
				return null
			}
			if (!rec.username) {
				return null
			}
			if (!rec.password) {
				return null
			}
			const roles = rec.roles || []
			const refreshToken = rec.refreshToken || ''
			return new UserRecord(rec.username, rec.password, roles, refreshToken)
		} catch {
			return null
		}
	}

	toDBObj(): any {
		return {
			username: this.username,
			password: this.password,
			roles: this.roles,
			refreshToken: this.refreshToken
		}
	}
}

async function hash(plaintext: string): Promise<string> {
	return await bcrypt.hash(plaintext, 10)
}

function userKey(username: string): string {
	return `Username: ${username}`
}

function refreshTokenKey(token: string): string {
	return `Refresh token: ${token}`
}

function getByUsername(username: string): UserRecord | null {
	return UserRecord.fromDBObj(db.get(userKey(username)))
}

function getByRefreshToken(token: string): UserRecord | null {
	return UserRecord.fromDBObj(db.get(refreshTokenKey(token)))
}

async function insertOrUpdateUser(record: UserRecord) {
	const currRec = getByUsername(record.username)
	const currRefresh = currRec?.refreshToken || ''

	// Save the user record, keyed on username.
	db.set(userKey(record.username), record)

	// Save the user record, keyed on refresh token.
	// OR, if the refresh token is empty, clear any stored refresh token.
	if (record.refreshToken) {
		db.set(refreshTokenKey(record.refreshToken), record)
	} else if (currRefresh) {
		db.delete(refreshTokenKey(currRefresh))
	}
}

// Add a new user account.
// Fail if an account with the given name already exists.
// Return whether or not the account was added.
export async function addUser(username: string, password: string): Promise<boolean> {
	if (!username || !password) {
		return Promise.reject('Neither username nor password may be empty.')
	}

	try {
		const existing = UserRecord.fromDBObj(db.get(userKey(username)))
		if (existing) {
			return Promise.reject('User already exists')
		}

		const hashedPass = await hash(password)
		if (!hashedPass) {
			return Promise.reject('Could not hash password')
		}
		const record = new UserRecord(username, password)
		insertOrUpdateUser(record)
		return true
	} catch (e) {
		return Promise.reject(e)
	}
}

// Remove a user account.
export async function removeUser(username: string): Promise<boolean> {
	const existing = UserRecord.fromDBObj(db.get(userKey(username)))
	if (!existing) {
		return Promise.reject('Record not found')
	}
	if (!db.delete(username)) {
		return Promise.reject('Failed to delete record')
	}
	return true
}

// Authenticate a user.
// If successful, update and return the user's refresh token.
export async function authenticate(username: string, password: string): Promise<string> {
	const json = db.get(userKey(username))
	const record = UserRecord.fromDBObj(json)
	if (record) {
		const passwordIsCorrect = await bcrypt.compare(password, record.password)
		if (passwordIsCorrect) {
			let result = record.refreshToken
			if (!result) {
				result = newRefreshToken(username)
				record.refreshToken = result
				insertOrUpdateUser(record)
			}
			return result
		}
	}
	// Be vague, on purpose.
	return Promise.reject('User authentication failed')
}

// Get the user associated with a refresh token, if any.
export function usernameForRefreshTokenSync(token: string): string {
	const record = UserRecord.fromDBObj(getByRefreshToken(token))
	return record?.username || ''
}

// Remove a user's current refresh token, if any.
export async function removeRefreshToken(username: string) {
	const record = UserRecord.fromDBObj(db.get(userKey(username)))
	if (record) {
		record.refreshToken = ''
		insertOrUpdateUser(record)
	}
}

// Persistent store initialization:
async function addDefaultAdminUser(username: string, password: string): Promise<boolean> {
	const existing = db.get(username)
	if (existing) {
		return true
	}
	const hashedPass = await hash(password)
	if (hashedPass) {
		const record = new UserRecord(username, hashedPass, ['admin'])
		insertOrUpdateUser(record)
		return true
	}
	return false
}

export async function initUserDB(dbPath: string, adminUsername: string, adminPassword: string) {
	const dbDataDir = path.dirname(path.resolve(dbPath))
	await fsPromises.mkdir(dbDataDir, { recursive: true })
	db = new JSONDB(dbPath)

	const success = await addDefaultAdminUser(adminUsername, adminPassword)
	if (!success) {
		console.error('Failed to initialize user DB.')
	}
}
