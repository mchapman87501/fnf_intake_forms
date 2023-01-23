// TODO consider a real database: npm install --save better-sqlite3

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

class UserRecord {
	username: string
	password: string // Hashed!
	roles: string[]

	constructor(username: string, password: string, roles: string[] = []) {
		this.username = username
		this.password = password
		this.roles = roles
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
			return new UserRecord(rec.username, rec.password, roles)
		} catch {
			return null
		}
	}

	toDBObj(): any {
		return {
			username: this.username,
			password: this.password,
			roles: this.roles
		}
	}
}

export type CreateRefreshTokenFn = (username: string) => string
export type Configuration = {
	dbPath: string
	adminUsername: string
	adminPassword: string
}

class UserDB {
	db: JSONDB | null = null

	// Don't call this!  Use the 'create' factory method instead.
	constructor() {}

	static async create(config: Configuration): Promise<UserDB> {
		const result = new UserDB()
		const dbDataDir = path.dirname(path.resolve(config.dbPath))
		await fsPromises.mkdir(dbDataDir, { recursive: true })
		result.db = new JSONDB(config.dbPath)

		const success = await result.#addDefaultAdminUser(config.adminUsername, config.adminPassword)
		if (success) {
			return result
		}
		return Promise.reject('Failed to initialize user DB.')
	}

	// Persistent store initialization:
	async #addDefaultAdminUser(username: string, password: string): Promise<boolean> {
		const existing = this.db?.get(this.#userKey(username))
		if (existing) {
			return true
		}

		return this.addUser(username, password, ['admin'])
	}

	async #hash(plaintext: string): Promise<string> {
		return await bcrypt.hash(plaintext, 10)
	}

	#userKey(username: string): string {
		return `Username: ${username}`
	}

	getByUsername(username: string): UserRecord | null {
		return UserRecord.fromDBObj(this.db?.get(this.#userKey(username)))
	}

	async #insertOrUpdateUser(record: UserRecord) {
		// Save the user record, keyed on username.
		this.db?.set(this.#userKey(record.username), record)
	}

	async addUser(username: string, password: string, roles: string[] = []): Promise<boolean> {
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
			const record = new UserRecord(username, hashedPass, roles)
			await this.#insertOrUpdateUser(record)
			return true
		} catch (e) {
			return Promise.reject(e)
		}
	}

	// // Remove a user account.
	// async removeUser(username: string): Promise<boolean> {
	// 	const existing = UserRecord.fromDBObj(this.db?.get(this.#userKey(username)))
	// 	if (!existing) {
	// 		return Promise.reject('Record not found')
	// 	}
	// 	if (!this.db?.delete(username)) {
	// 		return Promise.reject('Failed to delete record')
	// 	}
	// 	this.db?.sync()
	// 	return true
	// }

	async #compare(password: string, recordedPassword: string): Promise<boolean> {
		return new Promise((resolve, _) => {
			// I'm having trouble using bcrypt.compare (async).  For me it is throwing an uncaught
			// c++ exception.
			resolve(bcrypt.compareSync(password, recordedPassword))
		})
	}

	/**
	 * Authenticate a username/password.
	 * @param username username to authenticate
	 * @param password password to authenticate
	 * @returns whether or not the password is correct for the given username
	 */
	async auth(username: string, password: string): Promise<boolean> {
		const recObj = this.db?.get(this.#userKey(username))
		const record = UserRecord.fromDBObj(recObj)
		if (record) {
			return await this.#compare(password, record.password)
		}
		return false
	}

	isKnownUser(username: string): boolean {
		const record = UserRecord.fromDBObj(this.getByUsername(username))
		return record !== null
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

/**
 * Find out whether a given username is in the user database.
 * @param username Username to test
 * @returns whether or not the given username is in the database
 */
export function isKnownUser(username: string): boolean {
	return db?.isKnownUser(username) || false
}

/**
 * Authenticate a username and password.
 * @param username Username to authenticate
 * @param password Password to authenticate
 * @returns Whether the given username:password matches any database entry
 */
export async function auth(username: string, password: string): Promise<boolean> {
	if (db == null) {
		return Promise.reject("Can't authenticate: UserDB has not been configured")
	}
	return db?.auth(username, password) || false
}
