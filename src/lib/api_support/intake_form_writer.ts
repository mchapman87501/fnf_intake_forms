import { DownloadInfo } from '$lib/download_info'
import { createObjectCsvWriter } from 'csv-writer'
import path from 'path'
import fsPromises from 'fs/promises'

// TODO define CatPkg and ReceivedPkg as interfaces, in $lib.
export type CatPkg = any
export type ReceivedFromPkg = any

const dataDir = path.join(process.cwd(), 'data', 'out')

function getIntakeFormRows(catInfo: CatPkg, recvdFrom: ReceivedFromPkg) {
	interface Row {
		name: string
		value: any
		comments: string
	}
	function row(name: string, value: any): Row {
		return { name: name, value: value, comments: '' }
	}

	// TODO Standardize form values for Yes/No/Unknown selects
	function boolStr(value: boolean | string | null) {
		if (typeof value == 'string') {
			return value
		}
		return value === null ? 'Unknown' : value ? 'Yes' : 'No'
	}

	function posNegStr(value: boolean | null) {
		return value === null ? 'Unknown' : value ? 'Pos' : 'Neg'
	}

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

		row(
			'Courtesy listing (no relinquishment)) ',
			boolStr(recvdFrom.courtesyListingNoRelinquishment)
		),
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

function getCSVFilename(catInfo: CatPkg, receivedFrom: ReceivedFromPkg): string {
	const catName: string = catInfo.catName
	const intakeDate: string = catInfo.intakeDate // TODO verify MMDDYY
	const humanName: string = receivedFrom.fromName
	const rawStem = `${catName}-${humanName}-${intakeDate}`
	// Needed: filename sanitization rules.
	const validStemChars = Array.from(rawStem).flatMap((c) => {
		if (c.match(/(\w|-)/)) {
			return c
		} else if (c.match(/\s/)) {
			return '_'
		} else {
			return ''
		}
	})
	return validStemChars.join('').replaceAll(/[_-][_-]+/g, '_') + '.csv'
}

// Create a new intake form from the provided surrender info.
// This follows the sequence of routes/IntakeForm.svelte.
// TODO define $lib classes, with converters, for CatPkg, ReceivedFromPkg,
// OwnerSurrender and Intake.

// Save a new intake form, and return its download link.
export async function saveIntakeForm(
	catInfo: CatPkg,
	receivedFrom: ReceivedFromPkg
): Promise<DownloadInfo> {
	const csvFilename = getCSVFilename(catInfo, receivedFrom)
	const csvPathname = path.join(dataDir, csvFilename)
	try {
		await fsPromises.mkdir(dataDir, { recursive: true })

		const csvHeaders = [
			{ id: 'name', title: '' },
			{ id: 'value', title: 'INFO' },
			{ id: 'comments', title: 'COMMENTS' }
		]
		const records = getIntakeFormRows(catInfo, receivedFrom)

		const fileWriter = createObjectCsvWriter({
			path: csvPathname,
			header: csvHeaders
		})
		await fileWriter.writeRecords(records)

		const downloadURL = encodeURI(`/api/v1/download/${csvFilename}`)
		return new DownloadInfo(downloadURL, csvFilename)
	} catch (e: any) {
		console.error(e.message)
		return Promise.reject(e.message)
	}
}
