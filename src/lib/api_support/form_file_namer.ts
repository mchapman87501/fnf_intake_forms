import * as path from 'path'
import fsPromises from 'fs/promises'

import type { SurrenderPkg } from 'src/infrastructure/info_packages'
import type { ProcessedSurrenderInfo } from './processed_surrender_info'

function ensureDir(dirname: string): string {
	fsPromises.mkdir(dirname, { recursive: true })
	return dirname
}

function pad(s: string, len: number): string {
	const padding = '0'.repeat(len)
	const overPadded = padding + s
	return overPadded.substring(overPadded.length - len)
}

class DayUniqueID {
	// XXX FIX THIS Assumes atomic updates
	static #currDate: string | undefined = undefined
	static #dayUniqueID: number | undefined

	static nextID(): string {
		const today = new Date()
		// Don't worry about padding for human-readability.
		const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
		if (DayUniqueID.#currDate != todayStr) {
			DayUniqueID.#currDate = todayStr
			DayUniqueID.#dayUniqueID = 1
		} else {
			DayUniqueID.#dayUniqueID = (DayUniqueID.#dayUniqueID || 1) + 1
		}
		return pad(`${DayUniqueID.#dayUniqueID}`, 2)
	}
}

export class FormFileNamer {
	#stemStem: string

	constructor(info: SurrenderPkg) {
		const medPrefix = info.catInfo.treatableMedical ? 'TM' : 'H'
		const dateComp = this.#mmddyy()
		const shelterID = info.receivedFrom.shelterNum || 'P'
		this.#stemStem = `${medPrefix}-${dateComp}-${shelterID}${DayUniqueID.nextID()}`
	}

	#mmddyy(): string {
		// Satisfy browsers like chrome that require
		// 'yyyy-mm-dd' as their input.
		const today = new Date()
		const year = today.getFullYear()
		const month = today.getMonth() + 1
		const day = today.getDate()

		const yStr = pad(year.toFixed(0), 2)
		const mStr = pad(month.toFixed(0), 2)
		const dStr = pad(day.toFixed(0), 2)
		const result = `${mStr}${dStr}${yStr}`
		return result
	}

	static #dataDir: string = ensureDir(path.join(process.cwd(), 'data', 'out'))

	static get dataDir(): string {
		return FormFileNamer.#dataDir
	}

	static set dataDir(newValue: string) {
		FormFileNamer.#dataDir = ensureDir(newValue)
	}

	#csvFilename(docSpecifier: string): string {
		return this.#sanitizedName(`${this.#stemStem}-${docSpecifier}`) + '.csv'
	}

	#csvPathname(docSpecifier: string): string {
		return path.join(FormFileNamer.dataDir, this.#csvFilename(docSpecifier))
	}

	// Create a sanitized filename from an unclean filename.
	#sanitizedName(uncleanFilename: string): string {
		// Needed: filename sanitization rules.
		const validStemChars = Array.from(uncleanFilename).flatMap((c) => {
			if (c.match(/(\w|-)/)) {
				return c
			} else if (c.match(/\s/)) {
				return '_'
			} else {
				return ''
			}
		})
		return validStemChars.join('').replaceAll(/[_-][_-]+/g, '_')
	}

	get #rescueID(): string {
		return this.#stemStem
	}

	get #surrenderPathname(): string {
		return this.#csvPathname('surrender')
	}

	get #strayPathname(): string {
		return this.#csvPathname('stray')
	}

	get #rescuePathname(): string {
		return this.#csvPathname('rescue')
	}

	// get #pregnantNursingPathname(): string {
	// 	return this.#csvPathname('preg-nursing')
	// }

	get #intakePathname(): string {
		return this.#csvPathname('intake')
	}

	// #photoPathname(origPhotoName: string): string {
	// 	const stem = this.#sanitizedName(`${this.#stemStem}-photo`)

	// 	// TODO Use std filename manipulation functions.
	// 	const suffixMatch = origPhotoName.match(/\.[^.]+$/)

	// 	if (suffixMatch === null) {
	// 		return stem + '.jpg'
	// 	}
	// 	return path.join(FormFileNamer.dataDir, stem + suffixMatch.at(0))
	// }

	ownerSurrenderInfo(): ProcessedSurrenderInfo {
		// TODO Support optional photo.
		return {
			surrenderID: this.#rescueID,
			surrenderType: 'Owner',
			surrenderFormPath: this.#surrenderPathname,
			intakeFormPath: this.#intakePathname,
			photoPath: null
		}
	}

	straySurrenderInfo(): ProcessedSurrenderInfo {
		return {
			surrenderID: this.#rescueID,
			surrenderType: 'Stray',
			surrenderFormPath: this.#strayPathname,
			intakeFormPath: this.#intakePathname,
			photoPath: null
		}
	}

	rescueSurrenderInfo(): ProcessedSurrenderInfo {
		return {
			surrenderID: this.#rescueID,
			surrenderType: 'Rescue',
			surrenderFormPath: this.#rescuePathname,
			intakeFormPath: this.#intakePathname,
			photoPath: null
		}
	}
}
