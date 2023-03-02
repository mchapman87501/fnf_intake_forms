import { beforeEach, afterEach, describe, expect, test } from 'vitest'
import fsPromises from 'fs/promises'
import * as fs from 'fs'
import * as path from 'path'

import { temporaryDirectory } from 'tempy'

import * as AppDB from '$lib/server/db/app_db'

import { FormFileNamer } from './form_file_namer'

import { newCatPkg, newReceivedFromPkg, type SurrenderPkg } from '$lib/infrastructure/info_packages'
import type { SurrenderDownloads } from '$lib/api_support/surrender_and_intake_info'
import {
	processOwnerSurrender,
	processRescueSurrender,
	processStraySurrender
} from './surrender_processing'

describe('Surrender Processing tests', async () => {
	beforeEach(async () => {
		FormFileNamer.dataDir = temporaryDirectory()
		await AppDB.configure({ dbPath: ':memory:' })
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
			catInfo: { ...newCatPkg(), catName: 'Buddy Boy', treatableMedical: true },
			receivedFrom: { ...newReceivedFromPkg(), shelterNum: 'P' }
		}

		const result = await method(pkg)

		const intakeFName = result.intake.filename
		const expectedIntakeFName = /^Buddy-Boy_intake_TM-.*\.xlsx$/
		expect(intakeFName.match(expectedIntakeFName), intakeFName).not.toBeNull()

		const intakeSRFName = result.intakeSingleRow.filename
		const expectedIntakeSRFName = /^Buddy-Boy_intake-single-row_TM-.*\.csv$/
		expect(intakeSRFName.match(expectedIntakeSRFName), intakeSRFName).not.toBeNull()

		const intakeCoreName = intakeFName.replace(/.[^.]+$/, '')
		expect(result.surrender.filename, result.surrender.filename).toMatch(
			intakeCoreName.replace('_intake', formTypeName)
		)
		expect(resultFilesExist(result)).toBe(true)
	}

	test('Can process an owner surrender form', async () => {
		await testProcessMethod(processOwnerSurrender, '_surrender')
	})

	test('Can process a stray surrender form', async () => {
		await testProcessMethod(processStraySurrender, '_stray')
	})

	test('Can process a rescue surrender form', async () => {
		await testProcessMethod(processRescueSurrender, '_rescue')
	})
})
