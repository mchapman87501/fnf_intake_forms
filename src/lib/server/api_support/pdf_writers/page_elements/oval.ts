import { PageElement } from './page_element'
import type { IPage } from './pdf_interfaces'
import { fieldColor } from './settings'

export class Oval extends PageElement {
	async addToPage(page: IPage) {
		const meta = this.info
		const y = this.yPage(page, meta.y)
		page.drawEllipse({
			x: meta.x,
			y: y,
			xScale: meta.width,
			yScale: meta.height,
			borderOpacity: 1.0,
			borderWidth: 2,
			borderColor: fieldColor
		})
	}
}
