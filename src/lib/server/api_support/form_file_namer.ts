import * as path from 'path'
import fsPromises from 'fs/promises'

import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import type { ProcessedSurrenderInfo } from './processed_surrender_info'
import * as AppDB from '$lib/server/db/app_db'
import { getCatName } from '$lib/infrastructure/stores'

function ensureDir(dirname: string): string {
	fsPromises.mkdir(dirname, { recursive: true })
	return dirname
}

export class FormFileNamer {
	#rescueID: string
	#catName: string

	constructor(info: SurrenderPkg) {
		this.#rescueID = AppDB.shared?.rescueID.getID(info, new Date()) || ''
		this.#catName = getCatName(info.catInfo)
	}

	static #dataDir: string = ensureDir(path.join(process.cwd(), 'data', 'out'))

	static get dataDir(): string {
		return FormFileNamer.#dataDir
	}

	static set dataDir(newValue: string) {
		FormFileNamer.#dataDir = ensureDir(newValue)
	}

	#path(docSpecifier: string, suffix: string): string {
		const nameTemplate = `${this.#catName}_${docSpecifier}_${this.#rescueID}`
		const pathname = this.#sanitizedName(nameTemplate) + suffix
		return path.join(FormFileNamer.dataDir, pathname)
	}

	#csvPathname(docSpecifier: string): string {
		return this.#path(docSpecifier, '.csv')
	}

	#excelPathname(docSpecifier: string): string {
		return this.#path(docSpecifier, '.xlsx')
	}

	#pdfPathname(docSpecifier: string): string {
		return this.#path(docSpecifier, '.pdf')
	}

	// Create a sanitized filename from an unclean filename.
	#sanitizedName(uncleanFilename: string): string {
		// Needed: filename sanitization rules.
		const validStemChars = Array.from(uncleanFilename).flatMap((c) => {
			if (c.match(/(\w|-)/)) {
				return c
			} else if (c.match(/\s/)) {
				return '-'
			} else {
				return ''
			}
		})
		return validStemChars.join('').replaceAll(/[_-][_-]+/g, '-')
	}

	get #surrenderPathname(): string {
		return this.#excelPathname('surrender')
	}

	get #surrenderPDFPathname(): string {
		return this.#pdfPathname('surrender')
	}

	get #strayPathname(): string {
		return this.#excelPathname('stray')
	}

	get #strayPDFPathname(): string {
		return this.#pdfPathname('stray')
	}

	get #rescuePathname(): string {
		return this.#excelPathname('rescue')
	}

	get #rescuePDFPathname(): string {
		return this.#pdfPathname('rescue')
	}

	// get #pregnantNursingPathname(): string {
	// 	return this.#csvPathname('preg-nursing')
	// }

	get #intakePathname(): string {
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
			surrenderPDFPath: this.#surrenderPDFPathname,
			intakeFormPath: this.#intakePathname,
			intakeSingleRowFormPath: this.#intakeWidePathname,
			photoPath: undefined
		}
	}

	straySurrenderInfo(): ProcessedSurrenderInfo {
		return {
			rescueID: this.#rescueID,
			catName: this.#catName,
			surrenderType: 'Stray',
			surrenderFormPath: this.#strayPathname,
			surrenderPDFPath: this.#strayPDFPathname,
			intakeFormPath: this.#intakePathname,
			intakeSingleRowFormPath: this.#intakeWidePathname,
			photoPath: undefined
		}
	}

	rescueSurrenderInfo(): ProcessedSurrenderInfo {
		return {
			rescueID: this.#rescueID,
			catName: this.#catName,
			surrenderType: 'Rescue',
			surrenderFormPath: this.#rescuePathname,
			surrenderPDFPath: this.#rescuePDFPathname,
			intakeFormPath: this.#intakePathname,
			intakeSingleRowFormPath: this.#intakeWidePathname,
			photoPath: undefined
		}
	}
}
