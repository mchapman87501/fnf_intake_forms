import type Database from 'better-sqlite3'
import * as bcrypt from 'bcrypt'

export class User {
	#db: Database.Database

	constructor(db: Database.Database) {
		this.#db = db
		this.#initSchema()
	}

	#initSchema() {
		const queries = [
			`CREATE TABLE IF NOT EXISTS User(
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL,
                encrypted_password TEXT NOT NULL,
                disabled BOOLEAN DEFAULT FALSE,
                UNIQUE (username)
            )`,
			`CREATE TABLE IF NOT EXISTS UserRole(
                fk_user_id INTEGER NOT NULL REFERENCES User(id) ON DELETE CASCADE,
                role_name TEXT NOT NULL,
                UNIQUE (fk_user_id, role_name)
                )`
		]
		for (const query of queries) {
			const stmt = this.#db.prepare(query)
			stmt.run()
		}
	}

	/**
	 * Add or update a user record.
	 * @param username Name of user to add/update
	 * @param password User's unencrypted password
	 * @returns the user's ID
	 * @throws all kinds of errors
	 */
	async addOrUpdateUser(username: string, password: string): Promise<boolean> {
		if (!username || !password) {
			throw new Error('Neither username nor password may be empty.')
		}

		const query = 'INSERT OR REPLACE INTO User (username, encrypted_password) VALUES (?, ?)'
		const stmt = this.#db.prepare(query)
		const encPass = await this.#hash(password)
		stmt.run(username, encPass)
		// Presume success.
		return true
	}

	addRole(username: string, role: string): boolean {
		const query = 'INSERT INTO UserRole SELECT id, @role FROM User WHERE username=@username'
		const stmt = this.#db.prepare(query)
		stmt.run({ username: username, role: role })
		return true
	}

	isKnownUser(username: string): boolean {
		const query = 'SELECT COUNT(*) FROM User WHERE username=?'
		const stmt = this.#db.prepare(query)
		const cnt = stmt.pluck().get(username)
		return cnt > 0
	}

	async auth(username: string, password: string): Promise<boolean> {
		const query = 'SELECT encrypted_password FROM User WHERE username=?'
		const stmt = this.#db.prepare(query)
		const encryptedPass = stmt.pluck().get(username)
		if (encryptedPass === undefined) {
			return false
		}
		return this.#compare(password, encryptedPass)
	}

	async #hash(plaintext: string): Promise<string> {
		return bcrypt.hash(plaintext, 10)
	}

	async #compare(password: string, recordedPassword: string): Promise<boolean> {
		return new Promise((resolve, _) => {
			// I'm having trouble using bcrypt.compare (async).  For me it is throwing an uncaught
			// c++ exception.
			resolve(bcrypt.compareSync(password, recordedPassword))
		})
	}
}
