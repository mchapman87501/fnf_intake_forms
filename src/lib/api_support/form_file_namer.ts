import type { CatPkg, ReceivedFromPkg } from 'src/infrastructure/info_packages'

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

	constructor(catInfo: CatPkg, recvdFromInfo: ReceivedFromPkg) {
		const medPrefix = catInfo.treatableMedical ? 'TM' : 'H'
		const dateComp = this.#mmddyy()
		const shelterID = recvdFromInfo.shelterNum || 'P'
		this.#stemStem = `${medPrefix}-${dateComp}-${shelterID}${DayUniqueID.nextID()}`
	}

	#csvFilename(docSpecifier: string): string {
		return this.#sanitizedName(`${this.#stemStem}-${docSpecifier}`) + '.csv'
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

	get surrender(): string {
		return this.#csvFilename('surrender')
	}

	get stray(): string {
		return this.#csvFilename('stray')
	}

	get rescue(): string {
		return this.#csvFilename('rescue')
	}

	get pregnantNursing(): string {
		return this.#csvFilename('preg-nursing')
	}

	get intake(): string {
		return this.#csvFilename('intake')
	}

	photo(origPhotoName: string): string {
		const stem = this.#sanitizedName(`${this.#stemStem}-photo`)

		// TODO Use std filename manipulation functions.
		const suffixMatch = origPhotoName.match(/\.[^.]+$/)

		if (suffixMatch === null) {
			return stem + '.jpg'
		}
		return stem + suffixMatch.at(0)
	}
}
