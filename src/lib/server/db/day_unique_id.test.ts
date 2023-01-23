import { describe, expect, test } from 'vitest'

import { newDB } from './app_db'
import { DayUniqueID } from './day_unique_id'

describe('Test day-unique IDs', async () => {
	test('Day unique ID ascends within a single day, resets on day change', async () => {
		const duid = new DayUniqueID(await newDB(':memory:'))
		const date = new Date()

		for (let day = 5; day < 9; day++) {
			date.setFullYear(2023, 0, day)
			for (let i = 1; i <= 20; i++) {
				const actual = duid.consumeDayUniqueID(date)
				expect(actual, `i=${i}`).toBe(i)
			}
		}
	})
})
