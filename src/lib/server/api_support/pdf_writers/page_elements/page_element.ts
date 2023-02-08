import type { IPage } from './pdf_interfaces'

export type FieldInfo = {
	// Bounding box, in points
	x: number
	y: number
	width: number
	height: number
}

export class PageElement {
	protected info: FieldInfo

	constructor(info: FieldInfo) {
		this.info = info
	}

	/**
	 * Convert a y coord from top-left to bottom-left coordinate system.
	 * @param page Page for which to convert coordinates
	 * @param y points offset from top of page
	 * @returns y expressed as points from bottom of page
	 */
	yPage(page: IPage, y: number): number {
		const pagePos = page.getPosition()
		const pageHeight = page.getHeight()

		const top = pagePos.y + pageHeight
		return top - y
	}
}
