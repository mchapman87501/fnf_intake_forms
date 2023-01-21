import { afterAll, describe, expect, test } from 'vitest'
import * as fsPromises from 'fs/promises'
import * as fs from 'fs'
import * as path from 'path'
import { temporaryDirectory } from 'tempy'
import * as UserDB from './user_db'

describe('User DB tests', async () => {
	let dbDir = temporaryDirectory()

	afterAll(async () => {
		await fsPromises.rm(dbDir, { recursive: true, force: true })
	})

	test('configure adds an admin user', async () => {
		const dbPath = path.join(dbDir, 'user_db.json')
		await UserDB.configure({
			dbPath: dbPath,
			adminUsername: 'admin',
			adminPassword: 'password'
		})

		expect(fs.existsSync(dbPath)).toBe(true)

		await expect(UserDB.auth('admin', 'password')).resolves.toBe(true)
		await expect(UserDB.auth('admin', 'wrong password')).resolves.toBe(false)

		await expect(UserDB.auth('unknown user', 'paff')).resolves.toBe(false)
	})

	test('Use without config should report errors', async () => {
		UserDB.resetForTesting()
		await expect(UserDB.auth('admin', 'password')).rejects.toThrow(/has not been configured/)
	})

	test('isKnownUser', async () => {
		const dbPath = path.join(dbDir, 'user_db_iku.json')
		await UserDB.configure({
			dbPath: dbPath,
			adminUsername: 'admin',
			adminPassword: 'password'
		})
		expect(UserDB.isKnownUser('admin')).toBe(true)
		expect(UserDB.isKnownUser('anonymous')).toBe(false)
	})

	test('Can configure with existing database', async () => {
		const dbPath = path.join(dbDir, 'user_db_iku.json')
		const config: UserDB.Configuration = {
			dbPath: dbPath,
			adminUsername: 'admin',
			adminPassword: 'password'
		}
		await UserDB.configure(config)
		await expect(UserDB.configure(config)).resolves.toBe(undefined)
	})
})
