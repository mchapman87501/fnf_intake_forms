import type { SurrenderPkg } from 'src/infrastructure/info_packages'

function pad(s: string, len: number): string {
	const padding = '0'.repeat(len)
	const overPadded = padding + s
	return overPadded.substring(overPadded.length - len)
}

class DayUniqueID {
	// XXX FIX THIS Assumes atomic updates
	#currDate: string | undefined = undefined
	#dayUniqueID: number | undefined = undefined

	nextID(date: Date): string {
		// Don't worry about padding for human-readability.
		const todayStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
		if (this.#currDate != todayStr) {
			this.#currDate = todayStr
			this.#dayUniqueID = 1
		} else {
			this.#dayUniqueID = (this.#dayUniqueID || 1) + 1
		}
		return pad(`${this.#dayUniqueID}`, 2)
	}
}

export class RescueID {
	#dud: DayUniqueID = new DayUniqueID()

	#mmddyy(date: Date): string {
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()

		const yStr = pad(year.toFixed(0), 2)
		const mStr = pad(month.toFixed(0), 2)
		const dStr = pad(day.toFixed(0), 2)
		const result = `${mStr}${dStr}${yStr}`
		return result
	}

	getID(info: SurrenderPkg, date: Date) {
		const medPrefix = info.catInfo.treatableMedical ? 'TM' : 'H'
		const dateComp = this.#mmddyy(date)
		const shelterID = info.receivedFrom.shelterNum || 'P'
		const dayUniqueID = this.#dud.nextID(date)
		return `${medPrefix}-${dateComp}-${shelterID}${dayUniqueID}`
	}
}
