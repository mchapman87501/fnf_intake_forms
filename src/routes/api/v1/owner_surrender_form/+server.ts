import type { RequestEvent } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'
import {
	saveIntakeForm,
	type CatPkg,
	type ReceivedFromPkg,
	type FormParams,
	intakeNameMarker
} from '$lib/api_support/intake_form_writer'
import { writeFnFCSV, row, boolStr, type CSVRow } from '$lib/api_support/fnf_csv_writer'
import type { SurrenderIntakeInfo } from '$lib/api_support/surrender_and_intake_info'
import { getCSVDownloadURL, type DownloadInfo } from '$lib/api_support/download_info'
import { FormFileNamer } from '$lib/api_support/form_file_namer'

function getOwnerSurrenderFormRows(catInfo: CatPkg, recvdFrom: ReceivedFromPkg): CSVRow[] {
	return [
		row('Intake Date', catInfo.intakeDate),
		row('Intake Type', recvdFrom.surrenderType),
		row('Received From', recvdFrom.fromName),
		row('Drivers License', recvdFrom.driversLic),
		row('Street Address', recvdFrom.address),
		row('City', recvdFrom.city),
		row('State', recvdFrom.state),
		row('Zip Code', recvdFrom.zip),
		row('Phone', recvdFrom.phone),
		row('Email', recvdFrom.email),

		row('Name of Cat', catInfo.catName),
		row('DOB', catInfo.DOB),
		row('Gender', catInfo.gender),
		row('Spayed/Neutered', boolStr(catInfo.altered)),
		row('Breed', catInfo.breed),
		row('Color', catInfo.color),
		row('Markings', catInfo.markings),
		row('Microchipped', boolStr(catInfo.microchipped)),
		row('Microchip #', catInfo.microchipNum),
		row('Current on Shots', boolStr(catInfo.currentShots)),
		row('FELV/FIV Tested', boolStr(catInfo.FELVFIVTested)),
		row('FELV/FIV Tested Positive', boolStr(catInfo.FELVFIVPositive)),
		row('FELV/FIV Date Tested', catInfo.FELFVIFTestedDate),
		row('Previous Vet', catInfo.namePrevVet),
		row('Vet Phone', catInfo.phonePrevVet),

		row('Special Needs', catInfo.specialNeeds),
		row('Current Diet/Medications', catInfo.dietMedications),

		row('Likes Kids?', boolStr(catInfo.okKinder)),
		row('Likes Cats?', boolStr(catInfo.okCats)),
		row('Likes Dogs?', boolStr(catInfo.okDogs)),

		row('Reason for Surrender', catInfo.intakeReason),
		row('Courtesy listing (no relinquishment)', boolStr(recvdFrom.courtesyListingNoRelinquishment)),

		row('Treatable Medical', boolStr(catInfo.treatableMedical)),
		row('Ok to show (not Web only)', boolStr(catInfo.oKToShow)),

		row('Donation Amount', recvdFrom.donationAmount),
		row('Form of Payment', recvdFrom.donationForm),

		row('Received By', catInfo.intakeFnFRepr)
	]
}

async function saveOwnerSurrenderForm(
	formParams: FormParams,
	csvFilename: string
): Promise<DownloadInfo> {
	const records = getOwnerSurrenderFormRows(formParams.catInfo, formParams.receivedFrom)
	await writeFnFCSV(csvFilename, records)
	const url = getCSVDownloadURL(csvFilename)
	return { srcURL: url, filename: csvFilename }
}

export async function POST(event: RequestEvent): Promise<Response> {
	const formParams: FormParams = await event.request.json()
	// See src/infrastructure/stores.js
	const catInfo: CatPkg = formParams.catInfo
	const receivedFrom: ReceivedFromPkg = formParams.receivedFrom
	const filenamer = new FormFileNamer(catInfo.catName, receivedFrom.fromName)
	try {
		const intakeInfo = await saveIntakeForm(formParams, filenamer.intake)
		const surrenderInfo = await saveOwnerSurrenderForm(formParams, filenamer.surrender)
		const result: SurrenderIntakeInfo = {
			surrender: surrenderInfo,
			intake: intakeInfo
		}
		console.debug('Result: %o', result)
		return json(result)
	} catch (e: any) {
		console.error(e.message)
		return json('Failed to save intake record', { status: 500 })
	}
}
