import { beforeEach, afterEach, describe, expect, test } from 'vitest'

import type Database from 'better-sqlite3'
import { User } from './user'
import { newDB } from './app_db'

// This doesn't belong here...
describe('newDB test', async () => {
	test('Can create a new database', async () => {
		const db = await newDB(':memory:')
		expect(db).not.toBeNull()
		db.close()
	})
})

describe('User DB tests', async () => {
	let db: Database.Database

	beforeEach(async () => {
		db = await newDB(':memory:')
	})

	afterEach(async () => {
		db.close()
	})

	test('Can add a user', async () => {
		const userDB = new User(db)
		await expect(userDB.addOrUpdateUser('joe', 'seekrit')).resolves.toBe(true)
	})

	test('isKnownUser', async () => {
		const userDB = new User(db)
		expect(userDB.isKnownUser('anon')).toBe(false)
		await expect(userDB.addOrUpdateUser('anon', 'seekrit')).resolves.toBe(true)
		expect(userDB.isKnownUser('anon')).toBe(true)
	})

	test('Can update existing user', async () => {
		const userDB = new User(db)
		// Make sure we're not accidentally reusing a database.
		expect(userDB.isKnownUser('anon')).toBe(false)

		await expect(userDB.addOrUpdateUser('anon', 'seekrit')).resolves.toBe(true)
		await expect(userDB.addOrUpdateUser('anon', 'seekrit')).resolves.toBe(true)
	})

	test('Can add user roles', async () => {
		const userDB = new User(db)
		await expect(userDB.addOrUpdateUser('admin', 'sucrets')).resolves.toBe(true)
		expect(userDB.addRole('admin', 'administrator')).toBe(true)
	})

	test('Authenticate w. valid password succeeds', async () => {
		const userDB = new User(db)
		await expect(userDB.addOrUpdateUser('admin', 'sucrets')).resolves.toBe(true)
		await expect(userDB.auth('admin', 'sucrets')).resolves.toBe(true)
	})

	test('Authenticate w. wrong password fails', async () => {
		const userDB = new User(db)
		await expect(userDB.addOrUpdateUser('admin', 'sucrets')).resolves.toBe(true)
		await expect(userDB.auth('admin', 'wrong')).resolves.toBe(false)
	})

	test('Authenticate w. unknown user fails', async () => {
		const userDB = new User(db)
		await expect(userDB.addOrUpdateUser('admin', 'sucrets')).resolves.toBe(true)
		await expect(userDB.auth('nimda', 'sucrets')).resolves.toBe(false)
	})
})
