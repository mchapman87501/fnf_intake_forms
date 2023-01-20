import { beforeEach, afterEach, describe, expect, test } from 'vitest'
import fsPromises from 'fs/promises'
import { temporaryDirectory } from 'tempy'
import * as path from 'path'

import { newCatPkg, newReceivedFromPkg, type SurrenderPkg } from '$lib/infrastructure/info_packages'
import { saveIntakeForm } from './intake_form_writer'

describe('Test writing intake forms', async () => {
	let dataDir: string = ''
	beforeEach(() => {
		dataDir = temporaryDirectory()
	})

	afterEach(() => {
		fsPromises.rm(dataDir, { recursive: true, force: true })
	})

	test('Can write empty-ish form', async () => {
		const surrenderDate = '2023-01-18'
		const rescueID = 'FAKE-rescue-id'
		const surrenderType = 'Invalid-testing-value'
		const info: SurrenderPkg = {
			catInfo: { ...newCatPkg(), treatableMedical: true, intakeDate: surrenderDate },
			receivedFrom: { ...newReceivedFromPkg(), shelterNum: 'P', surrenderType: surrenderType }
		}
		const outpath = path.join(dataDir, 'intake.csv')
		const result = await saveIntakeForm(rescueID, info, outpath)
		expect(path.join(dataDir, result.filename)).toBe(outpath)

		const content = await fsPromises.readFile(outpath, { encoding: 'utf-8' })
		expect(content.indexOf(rescueID)).toBeGreaterThan(0)
		expect(content.indexOf(surrenderType)).toBeGreaterThan(0)
	})

	test('Reports at least some errors', async () => {
		const info: SurrenderPkg = {
			catInfo: { ...newCatPkg() },
			receivedFrom: { ...newReceivedFromPkg() }
		}
		const outpath = '/no/such/subdir/intake.csv'
		await expect(saveIntakeForm('rescue-id', info, outpath)).rejects.toThrow()
	})
})
