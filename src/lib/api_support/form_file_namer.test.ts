import { describe, expect, test } from 'vitest'
import { FormFileNamer } from './form_file_namer'

describe('Test generation of filenames for various forms', async () => {
	test('Filenames have a common root.', () => {
		const namer = new FormFileNamer('<Cat Name Here>', 'Provider of Cat')
		const expectedRoot = /^Cat_Name_Here-Provider_of_Cat-(\d+)-(.*)\.csv$/
		let index: string | undefined = undefined
		const filenames = [
			namer.intake,
			namer.pregnantNursing,
			namer.rescue,
			namer.stray,
			namer.surrender
		]
		let formTypes = new Set()
		filenames.forEach((filename) => {
			const match = filename.match(expectedRoot)
			expect(match).not.toBeNull()

			const filenameIndex = match?.at(1) || ''
			if (index === undefined) {
				index = filenameIndex
			} else {
				expect(index).toBe(filenameIndex)
			}

			const formType = match?.at(2) || ''
			expect(formType, `Non-empty form type '${formType}' from '${filename}'`).not.toBe('')
			formTypes.add(formType)
		})
		expect(formTypes.size, 'Each name has a unique form type').toBe(filenames.length)
	})
})
