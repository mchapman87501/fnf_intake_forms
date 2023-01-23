import type Database from 'better-sqlite3'
import { DayUniqueID } from './day_unique_id'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'

function pad(s: string, len: number): string {
	const padding = '0'.repeat(len)
	const overPadded = padding + s
	return overPadded.substring(overPadded.length - len)
}

export class RescueID {
	#dud: DayUniqueID

	constructor(db: Database.Database) {
		this.#dud = new DayUniqueID(db)
	}

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
		const dayUniqueID = pad(`${this.#dud.consumeDayUniqueID(date)}`, 2)
		return `${medPrefix}-${dateComp}-${shelterID}${dayUniqueID}`
	}
}
