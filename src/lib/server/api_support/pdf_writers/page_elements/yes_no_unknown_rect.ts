import type { IPage } from './pdf_interfaces'
import { Rect } from './rect'
import type { FieldInfo } from './page_element'

export class YesNoUnknownRect {
	#yesRect: Rect
	#noRect: Rect

	constructor(yes: FieldInfo, no: FieldInfo) {
		this.#yesRect = new Rect(yes)
		this.#noRect = new Rect(no)
	}

	async addToPage(page: IPage, value: boolean): Promise<void> {
		const rect = value ? this.#yesRect : this.#noRect
		rect.addToPage(page)
	}
}

export type BBox = {
	x: number
	y: number
	w: number
	h: number
}

export function ynuRect(yes: BBox, no: BBox): YesNoUnknownRect {
	function offset(bb: BBox): FieldInfo {
		return {
			x: bb.x,
			y: bb.y,
			width: bb.w,
			height: bb.h
		}
	}
	const yesFI = offset(yes)
	const noFI = offset(no)

	return new YesNoUnknownRect(yesFI, noFI)
}
