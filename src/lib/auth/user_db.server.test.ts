import { afterAll, describe, expect, test } from 'vitest'
import * as fsPromises from 'fs/promises'
import * as fs from 'fs'
import * as path from 'path'
import { temporaryDirectory } from 'tempy'
import * as UserDB from './user_db.server'

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
			adminPassword: 'password',
			createRefreshToken: (_: string) => {
				return 'Bogus refresh token'
			}
		})

		expect(fs.existsSync(dbPath)).toBe(true)

		expect(UserDB.authenticate('admin', 'password')).resolves.not.toBe('')
		expect(UserDB.authenticate('admin', 'wrong password')).rejects.toThrow(/authentication failed/)
	})

	test('Use without config should report errors', async () => {
		UserDB.resetForTesting()
		expect(UserDB.authenticate('admin', 'password')).rejects.toThrow(/has not been configured/)
	})
})
