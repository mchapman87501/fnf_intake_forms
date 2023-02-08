import { saveIntakeForm } from '$lib/server/api_support/form_writers/intake_form_writer'
import { FormFileNamer } from './form_file_namer'

import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import type { ProcessedSurrenderInfo } from './processed_surrender_info'
import type { DownloadInfo } from '$lib/api_support/download_info'
import type { SurrenderDownloads } from '$lib/api_support/surrender_and_intake_info'

import { emailSurrenderInfoLater } from '$lib/server/intake_emails/emailer'

// Indirect import of csv-writer seems to trigger a server-side-check error:
// TypeError: Cannot read properties of undefined (reading 'SSR')
import { saveOwnerSurrenderForm } from '$lib/server/api_support/form_writers/owner_form_writer'
import { saveRescueSurrenderForm } from './form_writers/rescue_form_writer'
import { saveStraySurrenderForm } from './form_writers/stray_form_writer'
import { saveWideIntakeForm } from './form_writers/wide_intake_form_writer'
import { saveOwnerSurrenderPDF } from './pdf_writers/owner_pdf_writer'
import { saveRescueSurrenderPDF } from './pdf_writers/rescue_pdf_writer'
import { saveStraySurrenderPDF } from './pdf_writers/stray_pdf_writer'

type SaveSurrenderFormMethod = (info: SurrenderPkg, csvPathname: string) => Promise<DownloadInfo>

async function processSurrenderPkg(
	pkg: SurrenderPkg,
	processingInfo: ProcessedSurrenderInfo,
	saveSurrenderForm: SaveSurrenderFormMethod,
	saveSurrenderPDF?: SaveSurrenderFormMethod
): Promise<SurrenderDownloads> {
	try {
		// Create the surrender and intake forms.
		let result: SurrenderDownloads = {
			surrender: await saveSurrenderForm(pkg, processingInfo.surrenderFormPath),
			intake: await saveIntakeForm(processingInfo.rescueID, pkg, processingInfo.intakeFormPath),
			intakeSingleRow: await saveWideIntakeForm(
				processingInfo.rescueID,
				pkg,
				processingInfo.intakeSingleRowFormPath
			)
		}
		if (saveSurrenderPDF !== undefined) {
			result.surrenderPDF = await saveSurrenderPDF(pkg, processingInfo.surrenderPDFPath)
		}
		// Email the forms whenever able.
		emailSurrenderInfoLater(processingInfo)

		return result
	} catch (e) {
		return Promise.reject(e)
	}
}

export async function processOwnerSurrender(pkg: SurrenderPkg): Promise<SurrenderDownloads> {
	const namer = new FormFileNamer(pkg)
	return processSurrenderPkg(
		pkg,
		namer.ownerSurrenderInfo(),
		saveOwnerSurrenderForm,
		saveOwnerSurrenderPDF
	)
}

export async function processRescueSurrender(pkg: SurrenderPkg): Promise<SurrenderDownloads> {
	const namer = new FormFileNamer(pkg)
	return processSurrenderPkg(
		pkg,
		namer.rescueSurrenderInfo(),
		saveRescueSurrenderForm,
		saveRescueSurrenderPDF
	)
}

export async function processStraySurrender(pkg: SurrenderPkg): Promise<SurrenderDownloads> {
	const namer = new FormFileNamer(pkg)
	return processSurrenderPkg(
		pkg,
		namer.straySurrenderInfo(),
		saveStraySurrenderForm,
		saveStraySurrenderPDF
	)
}
