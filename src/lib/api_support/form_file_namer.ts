export class FormFileNamer {
	#stemStem: string

	constructor(catName: string, humanName: string) {
		// TODO randomize
		const index = new Date().getTime()

		this.#stemStem = `${catName}-${humanName}-${index}`
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
}
