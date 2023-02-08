import * as path from 'path'

export class PDFTemplatePaths {
	static #dataDir: string = path.join(process.cwd(), 'pdf_templates')

	static get dataDir(): string {
		return PDFTemplatePaths.#dataDir
	}

	static set dataDir(newValue: string) {
		PDFTemplatePaths.#dataDir = newValue
	}

	pdfPath(stem: string): string {
		return path.join(PDFTemplatePaths.dataDir, stem + '.pdf')
	}

	get ownerSurrenderPathname(): string {
		return this.pdfPath('owner_surrender')
	}

	get rescueSurrenderPathname(): string {
		return this.pdfPath('rescue_surrender')
	}

	get straySurrenderPathname(): string {
		return this.pdfPath('stray_surrender')
	}
}
