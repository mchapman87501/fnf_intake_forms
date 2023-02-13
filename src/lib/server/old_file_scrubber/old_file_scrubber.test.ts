import { beforeEach, afterEach, describe, expect, test } from 'vitest'
import { temporaryDirectory } from 'tempy'
import * as path from 'path'
import * as fsPromises from 'fs/promises'
import * as fs from 'fs'

import { FormFileNamer } from '$lib/server/api_support/form_file_namer'

import * as scrubber from './old_file_scrubber'

describe('Old File Scrubber tests', async () => {
	beforeEach(async () => {
		FormFileNamer.dataDir = temporaryDirectory()
	})

	afterEach(async () => {
		// Wait for the emailer to snd the message.
		await fsPromises.rm(FormFileNamer.dataDir, { recursive: true, force: true })
	})

	test('Can scrub once', async () => {
		// Create a file that should not be scrubbed, and one that should
		// be scrubbed.
		const dataDir = FormFileNamer.dataDir

		const now = new Date().getTime()

		const newPath = path.join(dataDir, 'new_file.txt')
		await fsPromises.writeFile(newPath, 'I am new')

		const timeSinceCreation = 1000 * (60 * 5 + 1)
		const age = now - timeSinceCreation
		const ageDate = new Date()
		ageDate.setTime(age)
		const oldPath = path.join(dataDir, 'old_file.txt')
		await fsPromises.writeFile(oldPath, 'I am old')
		await fsPromises.utimes(oldPath, ageDate, ageDate)

		await scrubber.scrubOnce()

		expect(fs.existsSync(newPath)).toBe(true)
		expect(fs.existsSync(oldPath)).toBe(false)
	})
})
