import { row, writeFile, type Row } from './tall_excel_writer'
import type { DownloadInfo } from '$lib/api_support/download_info'
import { boolStr, dateStr, posNegStr, dateIfApplicable } from './value_converters'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import { getCatName } from '$lib/infrastructure/stores'

function getIntakeFormRows(rescueID: string, surrenderInfo: SurrenderPkg): Row[] {
	const catInfo = surrenderInfo.catInfo
	const recvdFrom = surrenderInfo.receivedFrom
	// This is derived from IntakeForm.svelte.

	// Issue #23: if spay/neuter status is either "Unknown" or "No",
	// leave spay/neuter date blank.
	const spayNeuterDate = dateIfApplicable(catInfo.altered, catInfo.alteredDate)
	const felvfivDate = dateIfApplicable(catInfo.FELVFIVTested, catInfo.FELVFIVTestedDate)
	const rabiesExpires = dateIfApplicable(catInfo.receivedRabiesVax, catInfo.rabiesExpirationDate)
	const fvrcpExpires = dateIfApplicable(catInfo.receivedFVRCPVax, catInfo.fvrcpExpirationDate)

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
		row('Name of Cat', getCatName(catInfo)),
		row('DOB', dateStr(catInfo.DOB)),
		row('Gender', catInfo.gender),
		row('Breed', catInfo.breed),
		row('Hair length', catInfo.hairLength),
		row('Color', catInfo.color),
		row('Current Weight', catInfo.currentWeight),
		row('Estimated Size at Maturity', catInfo.estMatureSize),
		row('Distinctive Features', catInfo.distinctiveFeatures),
		row('Spay/Neuter Date', spayNeuterDate),
		row('Where Done', catInfo.alteredFacility),
		row('FVRCP #1', dateStr(catInfo.FVRCP1)),
		row('FVRCP #2', dateStr(catInfo.FVRCP2)),
		row('FVRCP #3', dateStr(catInfo.FVRCP3)),
		row('FVRCP Expires', fvrcpExpires),
		row('Rabies Expires', rabiesExpires),
		row('FELV/FIV Test Date', felvfivDate),
		row('Pos/Neg?', posNegStr(catInfo.FELVFIVPositive)),
		row('Microchip #', catInfo.microchipNum),
		row('Likes Kids?', boolStr(catInfo.okKinder)),
		row('Likes Cats?', boolStr(catInfo.okCats)),
		row('Likes Dogs?', boolStr(catInfo.okDogs)),
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

/**
 * Save an intake form.
 * @param rescueID Identifies the rescue described by the for
 * @param surrenderInfo Information about the rescue
 * @param pathname Where to save the intake form
 * @returns A promise of DownloadInfo for the saved form
 */
export async function saveIntakeForm(
	rescueID: string,
	surrenderInfo: SurrenderPkg,
	pathname: string
): Promise<DownloadInfo> {
	return writeFile(pathname, 'Intake Form', getIntakeFormRows(rescueID, surrenderInfo))
}
