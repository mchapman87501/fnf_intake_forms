import * as path from 'path'
import { saveOwnerSurrenderPDF } from '$lib/server/api_support/pdf_writers/owner_pdf_writer'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'

// Goal: write PDFs and programmatically compare their
// raster representations vs. human-approved rasters.
import { describe, test } from 'vitest'

describe('Verify PDF annotations match reference images', async () => {
	const runInteractive = process.env.RUN_INTERACTIVE_TESTS !== undefined

	test.runIf(runInteractive)('Owner Surrender annotations', async () => {
		// From the pdf-lib github repository I infer that it is alright
		// to specify test input data paths relative to the project
		// root directory.
		// But I still don't know how to compare PDF images..
		let info: SurrenderPkg = {
			catInfo: {
				intakeDate: '2023-02-07',
				catName: 'Felix',
				treatableMedical: false,
				DOB: '2020-07-04',
				gender: 'Female',
				altered: 'No',
				alteredDate: undefined,
				alteredFacility: 'SnipsRUs',
				breed: 'Fat',
				color: 'Brown',
				markings: 'yes',
				microchipped: 'no',
				microchipNum: '666-666',
				FELVFIVTested: false,
				FELVFIVPositive: true,
				FELVFIVTestedDate: undefined,
				currentShots: true,
				namePrevVet: 'I. M. Cut',
				phonePrevVet: '(505) 505-5050',
				dietMedications: 'Food & Drugs',
				tameFeral: '',
				biteHistory: 'Unknown',
				declawed: false,
				illnessInjuryObs: '',
				personalityObs: '',
				strayNotes: '',
				intakeNotes: '',
				specialNeeds: '',
				okKinder: 'Unknown',
				okCats: 'Yes',
				okDogs: 'No',
				intakeReason: 'Just a whim.\nAlso, she bit me.',
				oKToShow: false,
				intakeFnFRepr: 'A. Volunteer',
				FVRCP1: undefined,
				FVRCP2: undefined,
				FVRCP3: undefined,
				rabiesExpirationDate: undefined,
				hairLength: 'short and long',
				currentWeight: '',
				estMatureSize: '',
				distinctiveFeatures: '',
				temperament: '',
				motherLittermates: '',
				knownHistory: '',
				otherCommentsInternalUseOnly: '',
				fosterHomeOnIntake: '',
				profilePic: ''
			},
			receivedFrom: {
				fromName: 'O. Nur',
				driversLic: 'NM 987456321',
				address: '1400 Busy St.',
				city: 'Santa Fe',
				state: 'NM',
				zip: '87501',
				phone: '(505) 995-1962',
				textOK: false,
				email: 'nobody@no_address.com',
				donationAmount: '2.95',
				donationForm: 'cash on barrelhead',
				surrenderType: 'Owner',
				locationOfRescue: '',
				descriptionOfRescue: '',
				shelterNum: '',
				shelterPrevID: '',
				courtesyListingNoRelinquishment: false,
				wantsMomBack: false
			}
		}

		const pathname = path.join(process.cwd(), 'data/out/example_owner_surrender.pdf')
		await saveOwnerSurrenderPDF(info, pathname)
		console.warn('This is an interactive test.')
		console.warn('To evaluate the results, examine %o', pathname)
	})
})
