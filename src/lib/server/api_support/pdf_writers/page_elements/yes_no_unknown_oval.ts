import type { IPage } from './pdf_interfaces'
import { Oval } from './oval'
import type { FieldInfo } from './page_element'

export class YesNoUnknownOval {
	#yesOval: Oval
	#noOval: Oval

	constructor(yes: FieldInfo, no: FieldInfo) {
		this.#yesOval = new Oval(yes)
		this.#noOval = new Oval(no)
	}

	async addToPage(page: IPage, value: any): Promise<void> {
		if (typeof value == 'boolean') {
			const oval = value ? this.#yesOval : this.#noOval
			oval.addToPage(page)
		}
		// If value is not a boolean -- e.g., if it is null || undefined,
		// draw no annotations.  The goal is to handle cases for which users
		// may have provided no value.
	}
}

export function ynu(xYes: number, xNo: number, y: number, w: number, h: number): YesNoUnknownOval {
	const yes: FieldInfo = {
		x: xYes + w / 2,
		y: y + h / 2,
		width: w / 2,
		height: h / 2
	}

	const no: FieldInfo = {
		x: xNo + w / 2,
		y: y + h / 2,
		width: w / 2,
		height: h / 2
	}

	return new YesNoUnknownOval(yes, no)
}
