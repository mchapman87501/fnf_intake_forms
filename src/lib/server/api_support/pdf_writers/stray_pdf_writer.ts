import { dateStr } from '$lib/server/api_support/form_writers/value_converters'
import * as fsPromises from 'fs/promises'

import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import { getDownloadInfo, type DownloadInfo } from '$lib/api_support/download_info'

import { PDFDocument, PDFPage } from 'pdf-lib'

import { TextField, tf } from './page_elements/text_field'
import { YesNoUnknownRect, ynuRect } from './page_elements/yes_no_unknown_rect'
import { PDFTemplatePaths } from './pdf_template_paths'

function annotatePage(page: PDFPage, info: SurrenderPkg) {
	function add(annotation: TextField | YesNoUnknownRect, value: any) {
		annotation.addToPage(page, value)
	}

	function yesNoUnknownFn(yesVal: string, noVal: string) {
		const lcYesVal = yesVal.toLowerCase()
		const lcNoVal = noVal.toLowerCase()
		function fn(sval: string): boolean | undefined {
			const lcSVal = sval.toLowerCase()
			if (lcSVal == lcYesVal) {
				return true
			} else if (lcSVal == lcNoVal) {
				return false
			}
			return undefined
		}
		return fn
	}

	// 'predicate' returns true for female, false for male
	const genderPred = yesNoUnknownFn('Female', 'Male')
	// True for tame, false for Feral:
	const tameFeralPred = yesNoUnknownFn('Tame', 'Feral')

	const catInfo = info.catInfo
	const recvdFrom = info.receivedFrom

	// Hm... there doesn't seem to be a field for date cat found...
	add(tf(188, 269, 112), '') // Date cat found

	add(tf(128, 291, 400), recvdFrom.locationOfRescue)

	add(tf(112, 313, 56), catInfo.breed)
	add(tf(211, 313, 84), catInfo.color)
	add(tf(356, 313, 79), catInfo.markings)
	add(
		ynuRect({ x: 440, y: 315, w: 32, h: 13 }, { x: 476, y: 315, w: 36, h: 13 }),
		tameFeralPred(catInfo.tameFeral)
	)
	add(tf(222, 335, 307), catInfo.illnessInjuryObs)
	add(tf(205, 357, 323), catInfo.personalityObs)

	add(tf(109, 401, 430, 36), catInfo.strayNotes)

	add(tf(360, 470, 134), dateStr(catInfo.intakeDate))

	add(tf(72, 506, 257), recvdFrom.fromName)
	add(tf(360, 506, 134), recvdFrom.driversLic)

	add(tf(72, 542, 250), recvdFrom.address)
	add(tf(360, 542, 134), recvdFrom.phone)

	// XXX FIX THIS duplicates logic in other PDF writers.
	let cityStateZip = `${recvdFrom.city}, ${recvdFrom.state}  ${recvdFrom.zip}`
	// Handle blank.
	if (cityStateZip == ',   ') {
		cityStateZip = ''
	}
	add(tf(72, 578, 250), cityStateZip)
	add(tf(360, 578, 134), recvdFrom.phone)

	add(tf(150, 614, 172), recvdFrom.email)

	add(tf(227, 636, 62), recvdFrom.donationAmount)
	add(tf(432, 636, 106), catInfo.intakeFnFRepr)

	add(tf(150, 691, 390, 36), catInfo.intakeNotes)
}

/**
 * Save a rescue surrender document.
 * @param info Description of the surrender
 * @param pathname Where to write the surrender document
 * @returns a promise of the Download info for the surrender document
 */
export async function saveStraySurrenderPDF(
	info: SurrenderPkg,
	pathname: string
): Promise<DownloadInfo> {
	const templatePath = new PDFTemplatePaths().straySurrenderPathname
	const pdfBytes = await fsPromises.readFile(templatePath)
	const pdfDoc = await PDFDocument.load(pdfBytes)

	const page = pdfDoc.getPage(0)
	annotatePage(page, info)

	const resultBytes = await pdfDoc.save()

	await fsPromises.writeFile(pathname, resultBytes)
	return getDownloadInfo(pathname)
}
