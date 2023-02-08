// Ease composition, testing by
// defining interfaces that match what pdf-lib provides

import type { StandardFonts, PDFFont } from 'pdf-lib'

export interface IDoc {
	embedFont(font: StandardFonts | string | Uint8Array | ArrayBuffer): Promise<PDFFont>
}

export interface IPosition {
	x: number
	y: number
}

export interface DrawEllipseOptions {
	x?: number
	y?: number
	xScale?: number
	yScale?: number
	borderOpacity?: number
	borderWidth?: number
	color?: any
	borderColor?: any
}

export interface DrawTextOptions {
	x?: number
	y?: number
	maxWidth?: number
	color?: any
	font?: PDFFont
	lineHeight?: number
	size?: number
}

export interface DrawRectangleOptions {
	x?: number
	y?: number
	width?: number
	height?: number
	borderWidth?: number
	borderColor?: any
	color?: any
}

export interface IPage {
	doc: IDoc

	getPosition(): IPosition
	getHeight(): number

	drawEllipse(options: DrawEllipseOptions): void
	drawText(text: string, options: DrawTextOptions): void
	drawRectangle(options: DrawRectangleOptions): void
}
