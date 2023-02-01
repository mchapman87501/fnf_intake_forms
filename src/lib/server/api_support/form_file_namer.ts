import * as path from 'path'
import fsPromises from 'fs/promises'

import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import type { ProcessedSurrenderInfo } from './processed_surrender_info'
import * as AppDB from '$lib/server/db/app_db'

function ensureDir(dirname: string): string {
	fsPromises.mkdir(dirname, { recursive: true })
	return dirname
}

export class FormFileNamer {
	#rescueID: string
	#catName: string

	constructor(info: SurrenderPkg) {
		this.#rescueID = AppDB.shared?.rescueID.getID(info, new Date()) || ''
		this.#catName = info.catInfo.catName || '(no name given)'
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

	#excelFilename(docSpecifier: string): string {
		return this.#sanitizedName(`${this.#rescueID}-${docSpecifier}`) + '.xlsx'
	}

	#csvPathname(docSpecifier: string): string {
		return path.join(FormFileNamer.dataDir, this.#csvFilename(docSpecifier))
	}

	#excelPathname(docSpecifier: string): string {
		return path.join(FormFileNamer.dataDir, this.#excelFilename(docSpecifier))
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

	get #intakeExcelPathname(): string {
		return this.#excelPathname('intake')
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
			catName: this.#catName,
			surrenderType: 'Owner',
			surrenderFormPath: this.#surrenderPathname,
			intakeFormPath: this.#intakePathname,
			intakeFormExcelPath: this.#intakeExcelPathname,
			intakeSingleRowFormPath: this.#intakeWidePathname,
			photoPath: null
		}
	}

	straySurrenderInfo(): ProcessedSurrenderInfo {
		return {
			rescueID: this.#rescueID,
			catName: this.#catName,
			surrenderType: 'Stray',
			surrenderFormPath: this.#strayPathname,
			intakeFormPath: this.#intakePathname,
			intakeFormExcelPath: this.#intakeExcelPathname,
			intakeSingleRowFormPath: this.#intakeWidePathname,
			photoPath: null
		}
	}

	rescueSurrenderInfo(): ProcessedSurrenderInfo {
		return {
			rescueID: this.#rescueID,
			catName: this.#catName,
			surrenderType: 'Rescue',
			surrenderFormPath: this.#rescuePathname,
			intakeFormPath: this.#intakePathname,
			intakeFormExcelPath: this.#intakeExcelPathname,
			intakeSingleRowFormPath: this.#intakeWidePathname,
			photoPath: null
		}
	}
}
