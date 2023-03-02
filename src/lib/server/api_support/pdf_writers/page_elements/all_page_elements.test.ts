import { beforeEach, describe, expect, test } from 'vitest'
import { tf } from './text_field'
import type {
	DrawEllipseOptions,
	DrawRectangleOptions,
	IDoc,
	IPage,
	IPosition
} from './pdf_interfaces'
import { type PDFFont, PDFDocument } from 'pdf-lib'
import { ynu } from './yes_no_unknown_oval'
import { ynuRect, type BBox } from './yes_no_unknown_rect'

// TODO use vitest mock facilities
class MockDoc implements IDoc {
	#realDoc: Promise<PDFDocument>

	constructor() {
		this.#realDoc = PDFDocument.create()
	}

	async embedFont(font: string | Uint8Array | ArrayBuffer): Promise<PDFFont> {
		const doc = await this.#realDoc
		return doc.embedFont(font)
	}
}

class MockPage implements IPage {
	mockDock: MockDoc

	numGetPosCalls: number
	numGetHeightCalls: number
	numDrawEllipseCalls: number
	drawnEllipseXCoords: (number | undefined)[]

	numDrawRectangleCalls: number
	drawnRectOptions: DrawRectangleOptions[]

	numDrawTextCalls: number
	drawnTexts: string[]

	get doc(): IDoc {
		return this.mockDock
	}

	constructor(mockDoc: MockDoc) {
		this.mockDock = mockDoc
		this.numGetPosCalls = 0
		this.numGetHeightCalls = 0
		this.numDrawEllipseCalls = 0
		this.drawnEllipseXCoords = []

		this.numDrawRectangleCalls = 0
		this.drawnRectOptions = []

		this.numDrawTextCalls = 0
		this.drawnTexts = []
	}

	getPosition(): IPosition {
		this.numGetPosCalls += 1
		return { x: 0, y: 0 }
	}

	getHeight(): number {
		this.numGetHeightCalls += 1
		return 11 * 72
	}

	drawEllipse(options: DrawEllipseOptions): void {
		this.numDrawEllipseCalls += 1
		this.drawnEllipseXCoords.push(options.x)
	}

	drawText(text: string): void {
		this.numDrawTextCalls += 1
		this.drawnTexts.push(text)
	}

	drawRectangle(options: DrawRectangleOptions): void {
		this.numDrawRectangleCalls += 1
		this.drawnRectOptions.push(options)
	}
}

describe('Test TextField and YesNoUnknownOval', async () => {
	let doc: MockDoc
	let page: MockPage

	beforeEach(() => {
		doc = new MockDoc()
		page = new MockPage(doc)
	})

	test('tf can addToPage', async () => {
		const text = 'This is my text'
		const field = tf(10, 20, 3200, 14)

		await field.addToPage(page, text)

		expect(page.numDrawTextCalls).toBe(1)
		expect(page.drawnTexts.indexOf(text)).toBe(0)
	})

	test('tf can clip long text', async () => {
		const text = 'The slick frown box'.repeat(25)
		const field = tf(10, 10, 72, 14)
		await field.addToPage(page, text)
		expect(page.numDrawTextCalls).toBe(1)
		const drawnText = page.drawnTexts[0]
		expect(drawnText.length).toBeLessThan(text.length)
		expect(drawnText.endsWith('...')).toBe(true)
	})

	test('tf cannot clip multiline text', async () => {
		const text = 'The slick frown box\n'.repeat(3)
		const field = tf(10, 10, 72, 14)
		await field.addToPage(page, text)
		expect(page.numDrawTextCalls).toBe(1)
		const drawnText = page.drawnTexts[0]
		expect(drawnText).toBe(text)
	})

	test('ynu can addToPage', async () => {
		const yesLeft = 110
		const noLeft = 10
		const w = 14
		const field = ynu(yesLeft, noLeft, 20, w, 14)

		await field.addToPage(page, true)
		expect(page.numDrawEllipseCalls).toBe(1)
		expect(page.drawnEllipseXCoords).toStrictEqual([yesLeft + w / 2])

		await field.addToPage(page, false)
		expect(page.numDrawEllipseCalls).toBe(2)
		expect(page.drawnEllipseXCoords).toStrictEqual([yesLeft + w / 2, noLeft + w / 2])

		await field.addToPage(page, undefined)
		expect(page.numDrawEllipseCalls).toBe(2)

		await field.addToPage(page, null)
		expect(page.numDrawEllipseCalls).toBe(2)

		await field.addToPage(page, 'strings are ignored')
		expect(page.numDrawEllipseCalls).toBe(2)
	})

	test('ynuRect can addToPage', async () => {
		const yesBBox: BBox = {
			x: 10,
			y: 10,
			w: 100,
			h: 14
		}
		const noBBox: BBox = {
			x: 50,
			y: 10,
			w: 125,
			h: 14
		}

		const field = ynuRect(yesBBox, noBBox)
		await field.addToPage(page, true)
		expect(page.numDrawRectangleCalls).toBe(1)
		expect(page.drawnRectOptions[0].x).toBe(10)
		expect(page.drawnRectOptions[0].width).toBe(100)

		field.addToPage(page, false)
		expect(page.numDrawRectangleCalls).toBe(2)
		expect(page.drawnRectOptions[1].x).toBe(50)
		expect(page.drawnRectOptions[1].width).toBe(125)
	})
})
