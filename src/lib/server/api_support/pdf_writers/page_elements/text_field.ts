import { PDFFont, StandardFonts, rgb } from 'pdf-lib'
import type { IPage } from './pdf_interfaces'
import { PageElement } from './page_element'
import { fieldColor } from './settings'

type ClippedTextResult = {
	font: PDFFont
	size: number
	text: string
	height: number
	yOffset: number
}
type CTRPromise = Promise<ClippedTextResult>

export class TextField extends PageElement {
	#numLines(text: string): number {
		return text.split(/\r\n|\r|\n/).length
	}

	async #clippedText(page: IPage, text: string, maxWidth: number): CTRPromise {
		const doc = page.doc
		const font = await doc.embedFont(StandardFonts.Helvetica)
		let fontSize = 12
		// Clip single-line text only.
		const numLines = this.#numLines(text)
		if (numLines > 1) {
			// pdf-lib's drawText renders multiline text in a funny way.
			// First line appears to land at the specified y.
			// Subsequent lines land below.
			return {
				font: font,
				size: fontSize,
				text: text,
				height: fontSize * numLines,
				yOffset: numLines * fontSize
			}
		}
		const minFontSize = 6
		let width = font.widthOfTextAtSize(text, fontSize)
		while (width > maxWidth && fontSize > minFontSize) {
			fontSize -= 1
			width = font.widthOfTextAtSize(text, fontSize)
		}
		if (width <= maxWidth) {
			return {
				font: font,
				size: fontSize,
				text: text,
				height: font.heightAtSize(fontSize),
				yOffset: 0
			}
		}

		let clippedText = text
		let textLen = text.length
		while (width > maxWidth && textLen > 3) {
			textLen -= 1
			clippedText = text.slice(0, textLen) + '...'
			width = font.widthOfTextAtSize(clippedText, fontSize)
		}
		return {
			font: font,
			size: fontSize,
			text: clippedText,
			height: font.heightAtSize(fontSize),
			yOffset: 0
		}
	}

	async addToPage(page: IPage, value: any) {
		if (typeof value == 'string') {
			const meta = this.info
			const clipped = await this.#clippedText(page, value, meta.width)

			const yOffset = clipped.height
			const y = this.yPage(page, meta.y) + clipped.yOffset
			page.drawText(clipped.text, {
				x: meta.x,
				y: y,
				maxWidth: meta.width,
				color: fieldColor,
				font: clipped.font,
				lineHeight: clipped.height,
				size: clipped.size
			})
		}
	}
}

// Convenience factory function
export function tf(x: number, y: number, w: number, h: number = 14): TextField {
	return new TextField({
		x: x,
		y: y,
		width: w,
		height: h
	})
}
