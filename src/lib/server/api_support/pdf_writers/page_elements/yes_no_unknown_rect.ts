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

	async addToPage(page: IPage, value: any): Promise<void> {
		if (typeof value == 'boolean') {
			const rect = value ? this.#yesRect : this.#noRect
			rect.addToPage(page)
		}
		// If value is not a boolean -- e.g., if it is null || undefined,
		// draw no annotations.  The goal is to handle cases for which users
		// may have provided no value.
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
