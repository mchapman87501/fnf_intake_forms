import { PageElement } from './page_element'
import type { IPage } from './pdf_interfaces'
import { fieldColor } from './settings'

export class Rect extends PageElement {
	async addToPage(page: IPage) {
		const meta = this.info
		const y = this.yPage(page, meta.y)
		page.drawRectangle({
			x: meta.x,
			y: y,
			width: meta.width,
			height: meta.height,
			borderWidth: 2,
			borderColor: fieldColor
		})
	}
}
