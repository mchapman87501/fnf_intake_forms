import { beforeEach, afterEach, describe, expect, test } from 'vitest'
import fsPromises from 'fs/promises'
import { temporaryDirectory } from 'tempy'
import * as path from 'path'

import { newCatPkg, newReceivedFromPkg, type SurrenderPkg } from 'src/infrastructure/info_packages'
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
		const info: SurrenderPkg = {
			catInfo: { ...newCatPkg(), treatableMedical: true },
			receivedFrom: { ...newReceivedFromPkg(), shelterNum: 'P' }
		}
		const outpath = path.join(dataDir, 'intake.csv')
		const result = await saveIntakeForm(info, outpath)
	})
})
