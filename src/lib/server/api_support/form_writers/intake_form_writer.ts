import * as exceljs from 'exceljs'
import { getDownloadInfo, type DownloadInfo } from '$lib/api_support/download_info'
import { type CSVRow, writeTallCSV, row } from './tall_csv_writer'
import { boolStr, dateStr, posNegStr } from './value_converters'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'

function getIntakeFormRows(rescueID: string, surrenderInfo: SurrenderPkg): CSVRow[] {
	const catInfo = surrenderInfo.catInfo
	const recvdFrom = surrenderInfo.receivedFrom
	// This is derived from IntakeForm.svelte.
	return [
		row('Intake Date', dateStr(catInfo.intakeDate)),
		row('Intake By', catInfo.intakeFnFRepr),
		row('Received From', recvdFrom.fromName),

		row('Phone', recvdFrom.phone),
		row('Email', recvdFrom.email),

		row('Intake Reason', catInfo.intakeReason),
		row('Intake Type', recvdFrom.surrenderType),
		row('Shelter Number', recvdFrom.shelterNum),

		row('Courtesy listing (no relinquishment)', boolStr(recvdFrom.courtesyListingNoRelinquishment)),
		row('Ok to show (not Web only)', boolStr(catInfo.oKToShow)),
		row('Rescue ID', rescueID),
		row('Name of Cat', catInfo.catName),
		row('DOB', dateStr(catInfo.DOB)),
		row('Gender', catInfo.gender),
		row('Breed', catInfo.breed),
		row('Hair length', catInfo.hairLength),
		row('Color', catInfo.color),
		row('Current Weight', catInfo.currentWeight),
		row('Estimated Size at Maturity', catInfo.estMatureSize),
		row('Distinctive Features', catInfo.distinctiveFeatures),
		row('Spay/Neuter Date', dateStr(catInfo.alteredDate)),
		row('Where Done', catInfo.alteredFacility),
		row('FVRCP #1', dateStr(catInfo.FVRCP1)),
		row('FVRCP #2', dateStr(catInfo.FVRCP2)),
		row('FVRCP #3', dateStr(catInfo.FVRCP3)),
		row('Rabies Expires', dateStr(catInfo.rabiesExpirationDate)),
		row('FELV/FIV Test Date', dateStr(catInfo.FELVFIVTestedDate)),
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
	rescueID: string,
	surrenderInfo: SurrenderPkg,
	csvPathname: string
): Promise<DownloadInfo> {
	try {
		await writeTallCSV(csvPathname, getIntakeFormRows(rescueID, surrenderInfo))
		return getDownloadInfo(csvPathname)
	} catch (e: any) {
		return Promise.reject(e.message)
	}
}

export async function saveIntakeFormExcel(
	rescueID: string,
	surrenderInfo: SurrenderPkg,
	pathname: string
): Promise<DownloadInfo> {
	const wb = new exceljs.Workbook()
	const sheet = wb.addWorksheet('Intake Form')
	sheet.properties.defaultColWidth = 32
	sheet.columns = [
		{ header: '', key: 'name' },
		{ header: 'INFO', key: 'info' },
		{ header: 'COMMENTS', key: 'comments' }
	]
	const rows = getIntakeFormRows(rescueID, surrenderInfo)
	rows.forEach((row) => {
		sheet.addRow({ name: row.name, info: row.value, comments: row.comments })
	})

	await wb.xlsx.writeFile(pathname)
	return getDownloadInfo(pathname)
}
