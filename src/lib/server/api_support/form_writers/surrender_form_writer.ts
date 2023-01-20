import { writeTallCSV, row, type CSVRow } from './tall_csv_writer'
import { boolStr, dateStr } from './value_converters'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import { getDownloadInfo, type DownloadInfo } from '$lib/api_support/download_info'

function getOwnerSurrenderFormRows(info: SurrenderPkg): CSVRow[] {
	const catInfo = info.catInfo
	const recvdFrom = info.receivedFrom
	return [
		row('Intake Date', dateStr(catInfo.intakeDate)),
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
		row('DOB', dateStr(catInfo.DOB)),
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
		row('FELV/FIV Date Tested', dateStr(catInfo.FELVFIVTestedDate)),
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

export async function saveOwnerSurrenderForm(
	info: SurrenderPkg,
	csvPathname: string
): Promise<DownloadInfo> {
	const records = getOwnerSurrenderFormRows(info)
	await writeTallCSV(csvPathname, records)
	return getDownloadInfo(csvPathname)
}
