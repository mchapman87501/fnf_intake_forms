import { dateStr, boolStr } from '$lib/server/api_support/form_writers/value_converters'
import * as fsPromises from 'fs/promises'

import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import { getDownloadInfo, type DownloadInfo } from '$lib/api_support/download_info'

import { PDFDocument, PDFPage } from 'pdf-lib'

import { TextField, tf } from './page_elements/text_field'
import { YesNoUnknownOval, ynu } from './page_elements/yes_no_unknown_oval'
import { PDFTemplatePaths } from './pdf_template_paths'

function annotatePage(page: PDFPage, info: SurrenderPkg) {
	function add(annotation: TextField | YesNoUnknownOval, value: any) {
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

	// XXX FIX THIS there are still several variation on
	// model values that correspond to yes, no, unknown.
	// See, e.g., Definitions.svelte\genderChoices

	// 'predicate' returns true for female, false for male
	const genderPred = yesNoUnknownFn('Female', 'Male')

	const ynuPred = yesNoUnknownFn('Yes', 'No')

	const catInfo = info.catInfo
	const recvdFrom = info.receivedFrom

	add(tf(72, 279, 250, 14), recvdFrom.fromName)
	add(tf(72, 315, 250, 14), recvdFrom.address)

	let cityStateZip = `${recvdFrom.city}, ${recvdFrom.state}  ${recvdFrom.zip}`
	// Handle blank.
	if (cityStateZip == ',   ') {
		cityStateZip = ''
	}
	add(tf(72, 351, 250, 14), cityStateZip)

	add(tf(108.35, 387, 231.65, 14), recvdFrom.email)
	add(tf(324.25, 243, 134, 14), dateStr(catInfo.intakeDate))
	add(tf(324.25, 279, 134, 14), recvdFrom.driversLic)
	add(tf(324.25, 315, 134, 14), recvdFrom.phone)
	add(tf(324.25, 351, 134, 14), recvdFrom.phone)

	add(tf(144, 452.5, 111, 14), catInfo.catName)
	add(tf(340, 452.5, 55, 14), dateStr(catInfo.DOB))
	add(tf(482, 452.5, 38, 14), catInfo.altered)

	add(ynu(412, 396, 440.7, 11, 14), genderPred(catInfo.gender))

	add(tf(112.2, 474.5, 44, 14), catInfo.breed)
	add(tf(211.65, 474.5, 55, 14), catInfo.color)
	add(tf(329, 474.5, 77.5, 14), catInfo.markings)

	add(ynu(155.7, 170.85, 485, 11, 14), ynuPred(catInfo.microchipped))
	add(tf(264.5, 496, 142.5, 14), catInfo.microchipNum)

	add(tf(163.6, 518.3, 88.5, 14), 'TBD')
	const ffTestedText = boolStr(catInfo.FELVFIVTested)
	add(tf(348.4, 518.3, 55, 14), ffTestedText)

	if (ffTestedText == 'Yes') {
		add(tf(460, 518.3, 23.65, 14), catInfo.FELVFIVPositive ? 'Pos' : 'Neg')
		add(ynu(405.6, 434.5, 507.3, 23.4, 14), catInfo.FELVFIVPositive)
	}

	add(tf(198.7, 540.25, 161, 14), catInfo.namePrevVet)
	add(tf(404, 540.25, 88, 14), catInfo.phonePrevVet)

	add(tf(198.7, 562.2, 339, 36), catInfo.specialNeeds)
	add(tf(223.7, 606.5, 314, 14), catInfo.dietMedications)

	add(tf(225, 628.6, 27, 14), catInfo.okKinder)
	add(tf(290, 628.6, 27, 14), catInfo.okCats)
	add(tf(358, 628.6, 27, 14), catInfo.okDogs)

	add(tf(210, 672, 328, 36), catInfo.intakeReason)

	add(tf(229.5, 694, 50, 14), recvdFrom.donationAmount)
	add(tf(434.5, 694, 103.5, 14), catInfo.intakeFnFRepr)
}

/**
 * Save an owner surrender document.
 * @param info Description of the surrender
 * @param pathname Where to write the surrender document
 * @returns a promise of the Download info for the surrender document
 */
export async function saveOwnerSurrenderPDF(
	info: SurrenderPkg,
	pathname: string
): Promise<DownloadInfo> {
	const templatePath = new PDFTemplatePaths().ownerSurrenderPathname
	const pdfBytes = await fsPromises.readFile(templatePath)
	const pdfDoc = await PDFDocument.load(pdfBytes)

	const page = pdfDoc.getPage(0)
	annotatePage(page, info)

	const resultBytes = await pdfDoc.save()

	await fsPromises.writeFile(pathname, resultBytes)
	return getDownloadInfo(pathname)
}
