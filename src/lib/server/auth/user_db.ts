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
import * as bcrypt from 'bcrypt'
import path from 'path'
import fsPromises from 'fs/promises'

// Fragile: must invoke initUserDB before invoking any other exported functions.
// let db: JSONDB

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

export type CreateRefreshTokenFn = (username: string) => string
export type Configuration = {
	dbPath: string
	adminUsername: string
	adminPassword: string
	createRefreshToken: CreateRefreshTokenFn
}

class UserDB {
	db: JSONDB | null = null
	createRefreshToken: CreateRefreshTokenFn | null = null

	// Don't call this!  Use the 'create' factory method instead.
	constructor() {}

	static async create(config: Configuration): Promise<UserDB> {
		const result = new UserDB()
		const dbDataDir = path.dirname(path.resolve(config.dbPath))
		await fsPromises.mkdir(dbDataDir, { recursive: true })
		result.db = new JSONDB(config.dbPath)
		result.createRefreshToken = config.createRefreshToken

		const success = await result.#addDefaultAdminUser(config.adminUsername, config.adminPassword)
		if (success) {
			return result
		}
		return Promise.reject('Failed to initialize user DB.')
	}

	// Persistent store initialization:
	async #addDefaultAdminUser(username: string, password: string): Promise<boolean> {
		const existing = this.db?.get(username)
		if (existing) {
			return true
		}
		const hashedPass = await this.#hash(password)
		if (hashedPass) {
			const record = new UserRecord(username, hashedPass, ['admin'])
			this.#insertOrUpdateUser(record)
			return true
		}
		return false
	}

	async #hash(plaintext: string): Promise<string> {
		return await bcrypt.hash(plaintext, 10)
	}

	#userKey(username: string): string {
		return `Username: ${username}`
	}

	#refreshTokenKey(token: string): string {
		return `Refresh token: ${token}`
	}

	getByUsername(username: string): UserRecord | null {
		return UserRecord.fromDBObj(this.db?.get(this.#userKey(username)))
	}

	getByRefreshToken(token: string): UserRecord | null {
		return UserRecord.fromDBObj(this.db?.get(this.#refreshTokenKey(token)))
	}

	async #insertOrUpdateUser(record: UserRecord) {
		const currRec = this.getByUsername(record.username)
		const currRefresh = currRec?.refreshToken || ''

		// Save the user record, keyed on username.
		this.db?.set(this.#userKey(record.username), record)

		// Save the user record, keyed on refresh token.
		// OR, if the refresh token is empty, clear any stored refresh token.
		if (record.refreshToken) {
			this.db?.set(this.#refreshTokenKey(record.refreshToken), record)
		} else if (currRefresh) {
			this.db?.delete(this.#refreshTokenKey(currRefresh))
		}
		// Supposedly not necessary:
		this.db?.sync()
	}

	// Add a new user account.
	// Fail if an account with the given name already exists.
	// Return whether or not the account was added.
	async addUser(username: string, password: string): Promise<boolean> {
		if (!username || !password) {
			return Promise.reject('Neither username nor password may be empty.')
		}

		try {
			const existing = UserRecord.fromDBObj(this.db?.get(this.#userKey(username)))
			if (existing) {
				return Promise.reject('User already exists')
			}

			const hashedPass = await this.#hash(password)
			if (!hashedPass) {
				return Promise.reject('Could not hash password')
			}
			const record = new UserRecord(username, password)
			this.#insertOrUpdateUser(record)
			return true
		} catch (e) {
			return Promise.reject(e)
		}
	}

	// Remove a user account.
	async removeUser(username: string): Promise<boolean> {
		const existing = UserRecord.fromDBObj(this.db?.get(this.#userKey(username)))
		if (!existing) {
			return Promise.reject('Record not found')
		}
		if (!this.db?.delete(username)) {
			return Promise.reject('Failed to delete record')
		}
		this.db?.sync()
		return true
	}

	async #compare(password: string, recordedPassword: string): Promise<boolean> {
		return new Promise((resolve, _) => {
			// I'm having trouble using bcrypt.compare (async).  For me it is throwing an uncaught
			// c++ exception.
			resolve(bcrypt.compareSync(password, recordedPassword))
		})
	}

	// XXX FIX THIS uncouple from tokens.
	// Authenticate a user.
	// If successful, update and return the user's refresh token.
	async authenticate(username: string, password: string): Promise<string> {
		const json = this.db?.get(this.#userKey(username))
		const record = UserRecord.fromDBObj(json)
		if (record) {
			const passwordIsCorrect = await this.#compare(password, record.password)
			if (passwordIsCorrect) {
				let result: string = record.refreshToken
				if (!result) {
					if (this.createRefreshToken) {
						result = this.createRefreshToken(username)
					}
					record.refreshToken = result
					this.#insertOrUpdateUser(record)
				}
				return result
			}
		}
		return Promise.reject('User authentication failed')
	}

	// Get the user associated with a refresh token, if any.
	usernameForRefreshTokenSync(token: string): string {
		const record = UserRecord.fromDBObj(this.getByRefreshToken(token))
		return record?.username || ''
	}

	// Remove a user's current refresh token, if any.
	async removeRefreshToken(username: string) {
		const record = UserRecord.fromDBObj(this.db?.get(this.#userKey(username)))
		if (record) {
			record.refreshToken = ''
			this.#insertOrUpdateUser(record)
		}
	}
}

let db: UserDB | null = null

export async function configure(config: Configuration) {
	db = await UserDB.create(config)
}

// For testing...
export async function resetForTesting() {
	db = null
}

export function usernameForRefreshTokenSync(token: string): string {
	if (db == null) {
		console.error("Can't get username for refresh token: User DB has not been configured.")
	}
	return db?.usernameForRefreshTokenSync(token) || ''
}

export async function authenticate(username: string, password: string): Promise<string> {
	if (db === null) {
		return Promise.reject('User DB has not been configured.')
	}
	return db.authenticate(username, password)
}
