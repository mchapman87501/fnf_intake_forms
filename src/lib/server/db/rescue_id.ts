import type Database from 'better-sqlite3'
import { DayUniqueID } from './day_unique_id'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'

function dfmt(n: number, width: number): string {
	return n.toFixed(0).padStart(width, '0')
}

export class RescueID {
	#dud: DayUniqueID

	constructor(db: Database.Database) {
		this.#dud = new DayUniqueID(db)
	}

	#mmddyy(date: Date): string {
		const yStr = dfmt(date.getFullYear() % 100, 2)
		const mStr = dfmt(date.getMonth() + 1, 2)
		const dStr = dfmt(date.getDate(), 2)
		const result = `${mStr}${dStr}${yStr}`
		return result
	}

	getID(info: SurrenderPkg, date: Date): string {
		const medPrefix = info.catInfo.treatableMedical ? 'TM' : 'H'
		const dateComp = this.#mmddyy(date)
		const shelterID = info.receivedFrom.shelterNum || 'P'
		const dayUniqueID = dfmt(this.#dud.consumeDayUniqueID(date), 2)
		return `${medPrefix}-${dateComp}-${shelterID}${dayUniqueID}`
	}
}
