import { describe, expect, test } from 'vitest'
import * as path from 'path'
import { FormFileNamer } from './form_file_namer'
import { newCatPkg, newReceivedFromPkg, type SurrenderPkg } from '$lib/infrastructure/info_packages'

import * as AppDB from '$lib/server/db/app_db'

describe('Test generation of filenames for various forms', async () => {
	test('Can get owner surrender info', async () => {
		await AppDB.configure({ dbPath: ':memory:' })
		const pkg: SurrenderPkg = {
			catInfo: { ...newCatPkg(), treatableMedical: true },
			receivedFrom: { ...newReceivedFromPkg(), shelterNum: 'P' }
		}
		const dataDir = '/tmp/data_dir'
		FormFileNamer.dataDir = dataDir
		const namer = new FormFileNamer(pkg)
		const info = namer.ownerSurrenderInfo()
		expect(info.rescueID).toMatch(/^TM-/)
		expect(info.surrenderType.toLowerCase()).toBe('owner')
		expect(info.intakeFormExcelPath.startsWith(dataDir)).toBe(true)
		expect(path.basename(info.intakeFormExcelPath)).toMatch(/^TM-\d{6}-P\d{2}-intake\.xlsx/)
		expect(info.surrenderFormPath.startsWith(dataDir)).toBe(true)
		expect(path.basename(info.surrenderFormPath)).toMatch(/^TM-\d{6}-P\d{2}-surrender\.csv/)
	})
})
