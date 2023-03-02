import { row, writeFile, type Row } from './tall_excel_writer'
import { dateStr, boolStr } from './value_converters'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import type { DownloadInfo } from '$lib/api_support/download_info'

function getStrayFormRows(info: SurrenderPkg): Row[] {
	const catInfo = info.catInfo
	const recvdFrom = info.receivedFrom

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
		row('Location of Rescue', recvdFrom.locationOfRescue),

		row('DOB', dateStr(catInfo.DOB)),
		row('Gender', catInfo.gender),
		row('Spayed/Neutered', boolStr(catInfo.altered)),
		row('Spay/Neuter Date', spayNeuterDate),
		row('Spay/Neuter Location', catInfo.alteredFacility),

		row('Breed', catInfo.breed),
		row('Color', catInfo.color),
		row('Markings', catInfo.markings),
		row('Friendly/Feral', catInfo.tameFeral),

		row('Bite History?', boolStr(catInfo.biteHistory)),

		row('Illness or Injuries Observed', catInfo.illnessInjuryObs),
		row('Special Needs / Habits / Personality Observed', catInfo.specialNeedsHabitsPersonality),
		row('Notes', catInfo.strayNotes),

		row('Donation Amount', recvdFrom.donationAmount),
		row('Form of Payment', recvdFrom.donationForm),

		row('Intake Notes', catInfo.intakeNotes),
		row('Received By', catInfo.intakeFnFRepr)
	]
}

/**
 * Save a stray surrender document.
 * @param info Description of the surrender
 * @param pathname Where to write the surrender document
 * @returns a promise of the Download info for the surrender document
 */
export async function saveStraySurrenderForm(
	info: SurrenderPkg,
	pathname: string
): Promise<DownloadInfo> {
	const records = getStrayFormRows(info)
	return writeFile(pathname, 'Stray Surrender Form', records)
}
