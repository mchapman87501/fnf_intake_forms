import { describe, expect, test } from 'vitest'
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
		const filenames = [
			namer.intake,
			namer.pregnantNursing,
			namer.rescue,
			namer.stray,
			namer.surrender,
			namer.photo('goopy Eyes.png')
		]
		const numFilenames = filenames.length
		let formTypes = new Set()
		filenames.forEach((filename, fnIndex) => {
			const match = filename.match(expectedRoot)
			expect(match, `Find root of ${filename}`).not.toBeNull()

			const filenameIndex = match?.at(1) || ''
			if (index === undefined) {
				index = filenameIndex
			} else {
				expect(index).toBe(filenameIndex)
			}

			const formType = match?.at(2) || ''
			expect(formType, `Non-empty form type '${formType}' from '${filename}'`).not.toBe('')
			formTypes.add(formType)

			const suffix = match?.at(3) || ''
			const expectedSuffix = fnIndex == numFilenames - 1 ? 'png' : 'csv'
			expect(suffix, `Suffix ${suffix}`).toBe(expectedSuffix)
		})
		expect(formTypes.size, 'Each name has a unique form type').toBe(filenames.length)
	})
})
