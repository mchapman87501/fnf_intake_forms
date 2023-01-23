import { describe, expect, test } from 'vitest'
import { newCatPkg, newReceivedFromPkg, type SurrenderPkg } from '$lib/infrastructure/info_packages'
import { newDB } from './app_db'
import { RescueID } from './rescue_id'

describe('Test rescue ID generation', async () => {
	function surrenderPkg(hasTreatableMedical: boolean): SurrenderPkg {
		return {
			catInfo: { ...newCatPkg(), treatableMedical: hasTreatableMedical },
			receivedFrom: { ...newReceivedFromPkg(), shelterNum: 'P' }
		}
	}

	test.each([
		[2023, 0, 17, '-011723-'],
		[2001, 3, 20, '-042001-'],
		[2030, 11, 4, '-120430-']
	])('Contains date code', async (yearnum, zeroMonth, dayOfMonth, expected) => {
		const date = new Date()
		date.setFullYear(yearnum, zeroMonth, dayOfMonth)

		const idSrc = new RescueID(await newDB(':memory:'))
		const actual = idSrc.getID(surrenderPkg(false), date)
		expect(actual.indexOf(expected) > 0).toBe(true)
	})

	test.each([
		[false, 'H-'],
		[true, 'TM-']
	])('Treatable medical = %o', async (treatableMedical, expected) => {
		const date = new Date()
		date.setFullYear(2023, 0, 17)
		const idSrc = new RescueID(await newDB(':memory:'))
		const actual = idSrc.getID(surrenderPkg(treatableMedical), date)

		expect(actual.startsWith(expected)).toBe(true)
	})

	test('Day unique ID ascends, resets on new day', async () => {
		const pkg = surrenderPkg(false)
		const date = new Date()

		const idSrc = new RescueID(await newDB(':memory:'))

		for (let day = 5; day < 9; day++) {
			date.setFullYear(2023, 0, day)
			for (let i = 1; i <= 20; i++) {
				let dayCode = `${i}`
				if (i < 10) {
					dayCode = `0${i}`
				}
				const expected = `${dayCode}`
				const actual = idSrc.getID(pkg, date)
				expect(actual.endsWith(expected), `${actual} ends with ${expected}`).toBe(true)
			}
		}
	})

	test('Does not reset on server restart', async () => {
		const date = new Date()
		date.setFullYear(2023, 0, 17)
		// TODO use an actual filesystem path...
		const dbDocument = await newDB(':memory:')
		const idSrc = new RescueID(dbDocument)

		const iRestart = 3
		for (let i = 1; i <= iRestart; i++) {
			idSrc.getID(surrenderPkg(false), date)
		}

		const newSrc = new RescueID(dbDocument)
		const nextID = newSrc.getID(surrenderPkg(false), date)
		expect(nextID.endsWith('04'), nextID).toBe(true)
	})
})
