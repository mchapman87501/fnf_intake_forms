import { row, writeFile, type Row } from './tall_excel_writer'
import { boolStr, dateStr } from './value_converters'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import type { DownloadInfo } from '$lib/api_support/download_info'

function getRescueFormRows(info: SurrenderPkg): Row[] {
	const catInfo = info.catInfo
	const recvdFrom = info.receivedFrom
	// Issue #23: if spay/neuter status is either "Unknown" or "No",
	// leave spay/neuter date blank.
	const altered = catInfo.altered.toLowerCase() == 'yes'
	const spayNeuterDate = altered ? dateStr(catInfo.alteredDate) : ''

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

		row('Shelter Code', recvdFrom.shelterNum),
		row('ID at Previous Shelter', recvdFrom.shelterPrevID),

		row('DOB', dateStr(catInfo.DOB)),
		row('Gender', catInfo.gender),
		row('Spayed/Neutered', boolStr(catInfo.altered)),
		row('Spay/Neuter Date', spayNeuterDate),
		row('Spay/Neuter Location', catInfo.alteredFacility),

		row('Breed', catInfo.breed),
		row('Color', catInfo.color),
		row('Markings', catInfo.markings),
		row('Friendly/Feral', catInfo.tameFeral),

		row('Current on Shots', boolStr(catInfo.currentShots)),
		row('FELV/FIV Tested', boolStr(catInfo.FELVFIVTested)),
		row('FELV/FIV Tested Positive', boolStr(catInfo.FELVFIVPositive)),
		row('FELV/FIV Date Tested', dateStr(catInfo.FELVFIVTestedDate)),

		row('Previous Vet', catInfo.namePrevVet),
		row('Vet Phone', catInfo.phonePrevVet),

		row('Special Needs', catInfo.specialNeedsHabitsPersonality),
		row('Current Diet/Medications', catInfo.dietMedications),

		row('Likes Kids?', boolStr(catInfo.okKinder)),
		row('Likes Cats?', boolStr(catInfo.okCats)),
		row('Likes Dogs?', boolStr(catInfo.okDogs)),
		row('Bite History?', boolStr(catInfo.biteHistory)),

		row('Location of Rescue', recvdFrom.locationOfRescue),
		row('Courtesy listing (no relinquishment)', boolStr(recvdFrom.courtesyListingNoRelinquishment)),

		row('Treatable Medical', boolStr(catInfo.treatableMedical)),
		row('Ok to show (not Web only)', boolStr(catInfo.oKToShow)),

		row('Donation Amount', recvdFrom.donationAmount),
		row('Form of Payment', recvdFrom.donationForm),

		row('Intake Notes', catInfo.intakeNotes),
		row('Received By', catInfo.intakeFnFRepr)
	]
}

/**
 * Save a rescue surrender document.
 * @param info Description of the surrender
 * @param pathname Where to write the surrender document
 * @returns a promise of the Download info for the surrender document
 */
export async function saveRescueSurrenderForm(
	info: SurrenderPkg,
	pathname: string
): Promise<DownloadInfo> {
	const records = getRescueFormRows(info)
	return writeFile(pathname, 'Rescue Surrender Form', records)
}
