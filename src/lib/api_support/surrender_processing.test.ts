import { beforeEach, afterEach, describe, expect, test } from 'vitest'
import fsPromises from 'fs/promises'
import * as fs from 'fs'
import * as path from 'path'

import { temporaryDirectory } from 'tempy'

import { FormFileNamer } from './form_file_namer'
import { newCatPkg, newReceivedFromPkg, type SurrenderPkg } from 'src/infrastructure/info_packages'
import type { SurrenderDownloads } from './surrender_and_intake_info'
import {
	processOwnerSurrender,
	processRescueSurrender,
	processStraySurrender
} from './surrender_processing'

describe('Surrender Processing tests', async () => {
	beforeEach(async () => {
		FormFileNamer.dataDir = temporaryDirectory()
	})

	afterEach(async () => {
		// Wait for the emailer to snd the message.
		await fsPromises.rm(FormFileNamer.dataDir, { recursive: true, force: true })
	})

	function dataFileExists(filename: string): boolean {
		return fs.existsSync(path.join(FormFileNamer.dataDir, filename))
	}

	function resultFilesExist(result: SurrenderDownloads): boolean {
		// TODO verify each file contains valid CSV data.
		return (
			dataFileExists(result.intake.filename) &&
			dataFileExists(result.surrender.filename) &&
			dataFileExists(result.intakeSingleRow.filename)
		)
	}

	type ProcMethod = (pkg: SurrenderPkg) => Promise<SurrenderDownloads>

	async function testProcessMethod(method: ProcMethod, formTypeName: string) {
		const pkg: SurrenderPkg = {
			catInfo: { ...newCatPkg(), treatableMedical: true },
			receivedFrom: { ...newReceivedFromPkg(), shelterNum: 'P' }
		}

		const result = await method(pkg)

		expect(result.intake.filename.startsWith('TM-')).toBe(true)
		expect(result.intake.filename.endsWith('-intake.csv'), result.intake.filename).toBe(true)

		expect(result.intakeSingleRow.filename.startsWith('TM-')).toBe(true)
		expect(
			result.intakeSingleRow.filename.endsWith('-intake-single-row.csv'),
			result.intakeSingleRow.filename
		).toBe(true)

		expect(result.surrender.filename, result.surrender.filename).toMatch(
			result.intake.filename.replace('-intake', formTypeName)
		)
		expect(result.intakeSingleRow.filename, result.intakeSingleRow.filename).toMatch(
			result.intake.filename.replace('-intake', '-intake-single-row')
		)
		expect(resultFilesExist(result)).toBe(true)
	}

	test('Can process an owner surrender form.', async () => {
		await testProcessMethod(processOwnerSurrender, '-surrender')
	})

	test('Can process a stray surrender form.', async () => {
		await testProcessMethod(processStraySurrender, '-stray')
	})

	test('Can process a rescue surrender form.', async () => {
		await testProcessMethod(processRescueSurrender, '-rescue')
	})
})
