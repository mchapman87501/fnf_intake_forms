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

import { USER_DB_PATH, ADMIN_USERNAME, ADMIN_PASSWORD } from '$env/static/private'

const db = new JSONDB(USER_DB_PATH, { asyncWrite: true })

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

// Add a new user account.
// Fail if an account with the given name already exists.
// Return whether or not the account was added.
export async function addUser(username: string, password: string): Promise<boolean> {
	if (!username || !password) {
		return Promise.reject('Neither username nor password may be empty.')
	}

	try {
		const existing = UserRecord.fromDBObj(db.get(username))
		if (existing) {
			return Promise.reject('User already exists')
		}

		const hashedPass = await hash(password)
		if (!hashedPass) {
			return Promise.reject('Could not hash password')
		}
		const record = new UserRecord(username, password)
		db.set(username, record.toDBObj())
		console.debug('addUser: %o = %o', username, record.toDBObj())
		return true
	} catch (e) {
		return Promise.reject(e)
	}
}

// Remove a user account.
export async function removeUser(username: string): Promise<boolean> {
	const existing = UserRecord.fromDBObj(db.get(username))
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
	const json = db.get(username)
	console.debug('authenticate: json for "%o" = %o', username, json)
	const record = UserRecord.fromDBObj(json)
	console.debug('authenticate: record=%o', record)
	if (record) {
		const passwordIsCorrect = await bcrypt.compare(password, record.password)
		console.debug('authenticate: password is correct: %o', passwordIsCorrect)
		if (passwordIsCorrect) {
			let result = record.refreshToken
			if (!result) {
				result = crypto.randomUUID()
				record.refreshToken = result
				db.set(record.username, record.toDBObj())
			}
			console.debug('authenticate: refresh token %o', result)
			return result
		}
	}
	// Be vague, on purpose.
	return Promise.reject('User authentication failed')
}

// Get a user's current refresh token, if any.
export async function refreshToken(username: string): Promise<string | null> {
	const record = UserRecord.fromDBObj(db.get(username))
	return record?.refreshToken || ''
}

// Remove a user's current refresh token, if any.
export async function removeRefreshToken(username: string) {
	const record = UserRecord.fromDBObj(db.get(username))
	if (record) {
		record.refreshToken = ''
		db.set(record.username, record.toDBObj())
	}
}

// Persistent store initialization:
async function addDefaultAdminUser(): Promise<boolean> {
	const existing = db.get(ADMIN_USERNAME)
	if (!existing) {
		const hashedPass = await hash(ADMIN_PASSWORD)
		if (hashedPass) {
			const record = new UserRecord(ADMIN_USERNAME, hashedPass, ['admin'])
			console.debug('addDefaultAdminUser: %o = %o', record.username, record.toDBObj())
			db.set(record.username, record.toDBObj())
			return true
		}
	}
	return false
}

export async function initUserDB() {
	const dataDir = path.dirname(path.resolve(USER_DB_PATH))
	await fsPromises.mkdir(dataDir, { recursive: true })

	const success = await addDefaultAdminUser()
	console.debug('Initializing user database.')
	if (!success) {
		console.error('Failed to initialize user DB.')
	}
}
