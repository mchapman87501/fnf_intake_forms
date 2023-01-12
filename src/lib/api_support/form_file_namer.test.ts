import { describe, expect, test } from 'vitest'
import * as path from 'path'
import { FormFileNamer } from './form_file_namer'
import {
	newCatPkg,
	newReceivedFromPkg,
	type CatPkg,
	type ReceivedFromPkg
} from 'src/infrastructure/info_packages'

describe('Test generation of filenames for various forms', async () => {
	test('Filenames have a common root.', () => {
		const catInfo: CatPkg = { ...newCatPkg(), treatableMedical: false }
		const recvdFromInfo: ReceivedFromPkg = { ...newReceivedFromPkg(), shelterNum: 'P' }

		const namer = new FormFileNamer(catInfo, recvdFromInfo)
		const expectedRoot = /^H-\d{6}-P(\d{2})-(.+)\.(csv|png)$/
		let index: string | undefined = undefined
		const pathnames = [
			namer.intakePathname,
			namer.pregnantNursingPathname,
			namer.rescuePathname,
			namer.strayPathname,
			namer.surrenderPathname,
			namer.photoPathname('goopy Eyes.png')
		]
		const numPathnames = pathnames.length
		let formTypes = new Set()
		pathnames.forEach((pathname, fnIndex) => {
			const filename = path.basename(pathname)
			const match = filename.match(expectedRoot)
			expect(match, `Find root of ${filename}`).not.toBeNull()

			const filenameIndex = match?.at(1) || ''
			if (index === undefined) {
				index = filenameIndex
			} else {
				expect(index).toBe(filenameIndex)
			}

			const formType = match?.at(2) || ''
			expect(formType, `Non-empty form type '${formType}' from '${pathname}'`).not.toBe('')
			formTypes.add(formType)

			const suffix = match?.at(3) || ''
			const expectedSuffix = fnIndex == numPathnames - 1 ? 'png' : 'csv'
			expect(suffix, `Suffix ${suffix}`).toBe(expectedSuffix)
		})
		expect(formTypes.size, 'Each name has a unique form type').toBe(pathnames.length)
	})
})
