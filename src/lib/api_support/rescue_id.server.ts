import type { SurrenderPkg } from 'src/infrastructure/info_packages'

function pad(s: string, len: number): string {
	const padding = '0'.repeat(len)
	const overPadded = padding + s
	return overPadded.substring(overPadded.length - len)
}

class DayUniqueID {
	// XXX FIX THIS Assumes atomic updates
	static #currDate: string | undefined = undefined
	static #dayUniqueID: number | undefined

	static nextID(date: Date): string {
		// Don't worry about padding for human-readability.
		const todayStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
		if (DayUniqueID.#currDate != todayStr) {
			DayUniqueID.#currDate = todayStr
			DayUniqueID.#dayUniqueID = 1
		} else {
			DayUniqueID.#dayUniqueID = (DayUniqueID.#dayUniqueID || 1) + 1
		}
		return pad(`${DayUniqueID.#dayUniqueID}`, 2)
	}
}

function mmddyy(date: Date): string {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()

	const yStr = pad(year.toFixed(0), 2)
	const mStr = pad(month.toFixed(0), 2)
	const dStr = pad(day.toFixed(0), 2)
	const result = `${mStr}${dStr}${yStr}`
	return result
}

export function getRescueID(info: SurrenderPkg, date: Date) {
	const medPrefix = info.catInfo.treatableMedical ? 'TM' : 'H'
	const dateComp = mmddyy(date)
	const shelterID = info.receivedFrom.shelterNum || 'P'
	const dayUniqueID = DayUniqueID.nextID(date)
	return `${medPrefix}-${dateComp}-${shelterID}${dayUniqueID}`
}
