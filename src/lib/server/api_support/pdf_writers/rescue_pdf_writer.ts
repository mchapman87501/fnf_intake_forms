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

	// 'predicate' returns true for female, false for male
	const genderPred = yesNoUnknownFn('Female', 'Male')

	const catInfo = info.catInfo
	const recvdFrom = info.receivedFrom

	add(tf(324, 295, 134, 14), dateStr(catInfo.intakeDate))

	add(tf(72, 331, 251, 14), recvdFrom.fromName)
	add(tf(324, 331, 134, 14), recvdFrom.driversLic)

	add(tf(72, 367, 251, 14), recvdFrom.address)
	add(tf(324, 367, 134, 14), recvdFrom.phone)

	let cityStateZip = `${recvdFrom.city}, ${recvdFrom.state}  ${recvdFrom.zip}`
	// Handle blank.
	if (cityStateZip == ',   ') {
		cityStateZip = ''
	}
	add(tf(72, 403, 251, 14), cityStateZip)
	add(tf(324, 403, 134, 14), recvdFrom.phone)

	add(tf(107, 439, 245, 14), recvdFrom.email)

	add(tf(144, 472, 112, 14), catInfo.catName)
	add(tf(339, 472, 55, 14), dateStr(catInfo.DOB))

	add(ynu(411, 396, 461, 11, 14), genderPred(catInfo.gender))

	add(tf(481, 472, 40, 14), catInfo.altered)

	add(tf(112, 494, 55, 14), catInfo.breed)
	add(tf(211, 494, 55, 14), catInfo.color)
	add(tf(328, 494, 78, 14), catInfo.markings)

	add(tf(163, 516, 89, 14), 'TBD') // Current shots

	const ffTestedText = boolStr(catInfo.FELVFIVTested)
	add(tf(348, 516, 56, 14), ffTestedText)
	if (ffTestedText == 'Yes') {
		add(ynu(404, 433, 505, 27, 14), catInfo.FELVFIVPositive)
		add(tf(458, 516, 50, 14), catInfo.FELVFIVPositive ? 'Pos' : 'Neg')
	}

	add(tf(198, 538, 161, 14), catInfo.namePrevVet)
	add(tf(403, 538, 90, 14), catInfo.phonePrevVet)

	add(tf(195, 560, 340, 14), catInfo.specialNeeds)
	add(tf(150, 582, 384, 14), catInfo.dietMedications)

	add(tf(230, 604, 28, 14), catInfo.okKinder)
	add(tf(295, 604, 28, 14), catInfo.okCats)
	add(tf(363, 604, 28, 14), catInfo.okDogs)

	add(tf(227, 626, 310, 14), recvdFrom.locationOfRescue)

	add(tf(227, 670, 56, 14), recvdFrom.donationAmount)
	add(tf(446, 670, 89, 14), catInfo.intakeFnFRepr)
}

/**
 * Save a rescue surrender document.
 * @param info Description of the surrender
 * @param pathname Where to write the surrender document
 * @returns a promise of the Download info for the surrender document
 */
export async function saveRescueSurrenderPDF(
	info: SurrenderPkg,
	pathname: string
): Promise<DownloadInfo> {
	const templatePath = new PDFTemplatePaths().rescueSurrenderPathname
	const pdfBytes = await fsPromises.readFile(templatePath)
	const pdfDoc = await PDFDocument.load(pdfBytes)

	const page = pdfDoc.getPage(0)
	annotatePage(page, info)

	const resultBytes = await pdfDoc.save()

	await fsPromises.writeFile(pathname, resultBytes)
	return getDownloadInfo(pathname)
}
