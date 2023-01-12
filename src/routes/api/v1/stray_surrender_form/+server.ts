import type { RequestEvent } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'

import { FormFileNamer } from '$lib/api_support/form_file_namer'
import { saveIntakeForm, type FormParams } from '$lib/api_support/intake_form_writer'
import type { CatPkg, ReceivedFromPkg } from 'src/infrastructure/info_packages'
import { writeFnFCSV, row, boolStr, type CSVRow } from '$lib/api_support/fnf_csv_writer'
import type { SurrenderIntakeInfo } from '$lib/api_support/surrender_and_intake_info'
import { getDownloadInfo, type DownloadInfo } from '$lib/api_support/download_info'

import * as emailer from '$lib/intake_emails/emailer.server'

async function saveStraySurrenderForm(
	formParams: FormParams,
	csvPathname: string
): Promise<DownloadInfo> {
	// TBD Save the stray form.
	const records = [row('TBD', 'TBD')]
	await writeFnFCSV(csvPathname, records)
	return getDownloadInfo(csvPathname)
}

export async function POST(event: RequestEvent): Promise<Response> {
	const formParams: FormParams = await event.request.json()
	const namer = new FormFileNamer(formParams.catInfo, formParams.receivedFrom)

	try {
		const intakeInfo = await saveIntakeForm(formParams, namer.intakePathname)
		const surrenderInfo = await saveStraySurrenderForm(formParams, namer.strayPathname)

		emailer.emailSurrenderInfo({
			surrenderID: namer.surrenderID,
			surrenderType: 'Stray',
			surrenderFormPath: namer.strayPathname,
			intakeFormPath: namer.intakePathname,
			photoPath: null
		})

		const result: SurrenderIntakeInfo = {
			surrender: surrenderInfo,
			intake: intakeInfo
		}
		return json(result)
	} catch (e: any) {
		console.error(e.message)
		return json('Failed to save intake record', { status: 500 })
	}
}
