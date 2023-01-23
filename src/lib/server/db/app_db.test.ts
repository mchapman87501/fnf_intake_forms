import { describe, expect, test } from 'vitest'
import * as AppDB from './app_db'

describe('AppDB tests', async () => {
	test('Basic configuration', async () => {
		expect(AppDB.shared).toBeNull()
		await AppDB.configure({
			dbPath: ':memory:'
		})
		expect(AppDB.shared).not.toBeNull()
		expect(AppDB.shared?.rescueID).not.toBeNull()
		expect(AppDB.shared?.user).not.toBeNull()
		expect(AppDB.shared?.user.isKnownUser('anyone')).toBe(false)
	})

	test('With admin user', async () => {
		await AppDB.configure({
			dbPath: ':memory:',
			adminUsername: 'foo',
			adminPassword: 'bar'
		})
		expect(AppDB.shared?.user.isKnownUser('foo')).toBe(true)
		await expect(AppDB.shared?.user.auth('foo', 'bar')).resolves.toBe(true)
	})
})
