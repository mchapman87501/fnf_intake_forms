import * as path from 'path'
import fsPromises from 'fs/promises'

import type { SurrenderPkg } from 'src/infrastructure/info_packages'
import type { ProcessedSurrenderInfo } from './processed_surrender_info'
import { RescueID } from './rescue_id.server'

function ensureDir(dirname: string): string {
	fsPromises.mkdir(dirname, { recursive: true })
	return dirname
}

export class FormFileNamer {
	#idSrc: RescueID = new RescueID()
	#rescueID: string

	constructor(info: SurrenderPkg) {
		this.#rescueID = this.#idSrc.getID(info, new Date())
	}

	static #dataDir: string = ensureDir(path.join(process.cwd(), 'data', 'out'))

	static get dataDir(): string {
		return FormFileNamer.#dataDir
	}

	static set dataDir(newValue: string) {
		FormFileNamer.#dataDir = ensureDir(newValue)
	}

	#csvFilename(docSpecifier: string): string {
		return this.#sanitizedName(`${this.#rescueID}-${docSpecifier}`) + '.csv'
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

	get #intakeWidePathname(): string {
		return this.#csvPathname('intake-single-row')
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
			rescueID: this.#rescueID,
			surrenderType: 'Owner',
			surrenderFormPath: this.#surrenderPathname,
			intakeFormPath: this.#intakePathname,
			intakeSingleRowFormPath: this.#intakeWidePathname,
			photoPath: null
		}
	}

	straySurrenderInfo(): ProcessedSurrenderInfo {
		return {
			rescueID: this.#rescueID,
			surrenderType: 'Stray',
			surrenderFormPath: this.#strayPathname,
			intakeFormPath: this.#intakePathname,
			intakeSingleRowFormPath: this.#intakeWidePathname,
			photoPath: null
		}
	}

	rescueSurrenderInfo(): ProcessedSurrenderInfo {
		return {
			rescueID: this.#rescueID,
			surrenderType: 'Rescue',
			surrenderFormPath: this.#rescuePathname,
			intakeFormPath: this.#intakePathname,
			intakeSingleRowFormPath: this.#intakeWidePathname,
			photoPath: null
		}
	}
}
