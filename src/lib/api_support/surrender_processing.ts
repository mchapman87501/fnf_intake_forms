import { saveIntakeForm } from '$lib/api_support/form_writers/intake_form_writer'
import { FormFileNamer } from '$lib/api_support/form_file_namer'

import type { SurrenderPkg } from 'src/infrastructure/info_packages'
import type { ProcessedSurrenderInfo } from './processed_surrender_info'
import type { DownloadInfo } from './download_info'
import type { SurrenderDownloads } from '$lib/api_support/surrender_and_intake_info'

import { emailSurrenderInfoLater } from '$lib/intake_emails/emailer.server'

// Indirect import of csv-writer seems to trigger a server-side-check error:
// TypeError: Cannot read properties of undefined (reading 'SSR')
import { saveOwnerSurrenderForm } from '$lib/api_support/form_writers/surrender_form_writer'
import { saveRescueSurrenderForm } from './form_writers/rescue_form_writer'
import { saveStraySurrenderForm } from './form_writers/stray_form_writer'

type SaveSurrenderFormMethod = (info: SurrenderPkg, csvPathname: string) => Promise<DownloadInfo>

async function processSurrenderPkg(
	pkg: SurrenderPkg,
	processingInfo: ProcessedSurrenderInfo,
	saveSurrenderForm: SaveSurrenderFormMethod
): Promise<SurrenderDownloads> {
	try {
		// Create the surrender and intake forms.
		const result: SurrenderDownloads = {
			surrender: await saveSurrenderForm(pkg, processingInfo.surrenderFormPath),
			intake: await saveIntakeForm(pkg, processingInfo.intakeFormPath)
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
	return processSurrenderPkg(pkg, namer.ownerSurrenderInfo(), saveOwnerSurrenderForm)
}

export async function processRescueSurrender(pkg: SurrenderPkg): Promise<SurrenderDownloads> {
	const namer = new FormFileNamer(pkg)
	return processSurrenderPkg(pkg, namer.rescueSurrenderInfo(), saveRescueSurrenderForm)
}

export async function processStraySurrender(pkg: SurrenderPkg): Promise<SurrenderDownloads> {
	const namer = new FormFileNamer(pkg)
	return processSurrenderPkg(pkg, namer.straySurrenderInfo(), saveStraySurrenderForm)
}
