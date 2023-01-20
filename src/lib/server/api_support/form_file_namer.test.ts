import { describe, expect, test } from 'vitest'
import * as path from 'path'
import { FormFileNamer } from './form_file_namer'
import { newCatPkg, newReceivedFromPkg, type SurrenderPkg } from '$lib/infrastructure/info_packages'

describe('Test generation of filenames for various forms', async () => {
	test('Can get owner surrender info', () => {
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
		expect(info.intakeFormPath.startsWith(dataDir)).toBe(true)
		expect(path.basename(info.intakeFormPath)).toMatch(/^TM-\d{6}-P\d{2}-intake\.csv/)
		expect(info.surrenderFormPath.startsWith(dataDir)).toBe(true)
		expect(path.basename(info.surrenderFormPath)).toMatch(/^TM-\d{6}-P\d{2}-surrender\.csv/)
	})
})
