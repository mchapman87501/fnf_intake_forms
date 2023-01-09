import { getCSVDownloadURL, type DownloadInfo } from './download_info'
import { type CSVRow, writeFnFCSV, row, boolStr, posNegStr } from './fnf_csv_writer'

import type { ReceivedFromPkg, CatPkg } from 'src/infrastructure/info_packages'
export type FormParams = { [index: string]: any }

export const intakeNameMarker = '-intake-'

function getIntakeFormRows(catInfo: CatPkg, recvdFrom: ReceivedFromPkg): CSVRow[] {
	// This is derived from IntakeForm.svelte.
	return [
		row('Intake Date', catInfo.intakeDate),
		row('Intake By', catInfo.intakeFnFRepr),
		row('Received From', recvdFrom.fromName),

		row('Phone', recvdFrom.phone),
		row('Email', recvdFrom.email),

		row('Intake Reason', catInfo.intakeReason),
		row('Intake Type', recvdFrom.surrenderType),
		row('Shelter Number', recvdFrom.shelterNum),

		row('Courtesy listing (no relinquishment)', boolStr(recvdFrom.courtesyListingNoRelinquishment)),
		row('Ok to show (not Web only)', boolStr(catInfo.oKToShow)),
		row('Rescue ID', 'To do RESCUE ID'),
		row('Name of Cat', catInfo.catName),
		row('DOB', catInfo.DOB),
		row('Gender', catInfo.gender),
		row('Breed', catInfo.breed),
		row('Hair length', catInfo.hairLength),
		row('Color', catInfo.color),
		row('Current Weight', catInfo.currentWeight),
		row('Estimated Size at Maturity', catInfo.estMatureSize),
		row('Distinctive Features', catInfo.distinctiveFeatures),
		row('Spay/Neuter Date', catInfo.alteredDate),
		row('Where Done', catInfo.alteredFacility),
		row('FVRCP #1', catInfo.FVRCP1),
		row('FVRCP #2', catInfo.FVRCP2),
		row('FVRCP #3', catInfo.FVRCP3),
		row('Rabies Expires', catInfo.rabiesExpirationDate),
		row('FELV/FIV Test Date', catInfo.FELVFIVTestedDate),
		row('Pos/Neg?', posNegStr(catInfo.FELVFIVPositive)),
		row('Microchip #', catInfo.microchipNum),
		row('Likes Dogs?', boolStr(catInfo.okDogs)),
		row('Likes Cats?', boolStr(catInfo.okCats)),
		row('Likes Kids?', boolStr(catInfo.okKinder)),
		row('Bite History?', boolStr(catInfo.biteHistory)),
		row('Declawed?', boolStr(catInfo.declawed)),
		row('Special Needs?', catInfo.specialNeeds),
		row('Temperament', catInfo.temperament),
		row('Mother/Littermates', catInfo.motherLittermates),
		row('Known History', catInfo.knownHistory),
		row('Other Comments [internal use only]:', catInfo.otherCommentsInternalUseOnly),
		row('Foster Home upon Intake', catInfo.fosterHomeOnIntake),
		row('Altered:', catInfo.altered),
		row('Prevous Shelter Id', recvdFrom.shelterPrevID)
	]
}

// Save a new intake form, and return its download link.
export async function saveIntakeForm(
	formParams: FormParams,
	csvFilename: string
): Promise<DownloadInfo> {
	const catInfo = formParams['catInfo']
	const receivedFrom = formParams['receivedFrom']
	try {
		await writeFnFCSV(csvFilename, getIntakeFormRows(catInfo, receivedFrom))

		const downloadURL = getCSVDownloadURL(csvFilename)
		const result: DownloadInfo = { srcURL: downloadURL, filename: csvFilename }
		return result
	} catch (e: any) {
		console.error(e.message)
		return Promise.reject(e.message)
	}
}
