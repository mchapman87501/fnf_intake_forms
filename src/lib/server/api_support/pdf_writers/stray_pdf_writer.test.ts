import * as path from 'path'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import { saveStraySurrenderPDF } from './stray_pdf_writer'

// Goal: write PDFs and programmatically compare their
// raster representations vs. human-approved rasters.
import { describe, test } from 'vitest'
import { uynChoicesUnknown, uynChoicesYes } from '$lib/infrastructure/Definitions.svelte'
import { dateStr } from '../form_writers/value_converters'

describe('Verify PDF annotations match reference images', async () => {
	const runInteractive = process.env.RUN_INTERACTIVE_TESTS !== undefined

	test.runIf(runInteractive)('Rescue Surrender annotations', async () => {
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
				FELVFIVTested: uynChoicesYes,
				FELVFIVPositive: true,
				FELVFIVTestedDate: dateStr('2020-10-31'),
				currentShots: true,
				namePrevVet: 'I. M. Cut',
				phonePrevVet: '(505) 505-5050',
				dietMedications: 'Food & Drugs',
				tameFeral: 'Feral',
				biteHistory: 'Yes',
				declawed: false,
				illnessInjuryObs: 'No illness/injury',
				strayNotes: 'Multiline\nStray Notes',
				intakeNotes: 'Just some random\nIntake Notes',
				specialNeedsHabitsPersonality: 'No special needs',
				okKinder: 'Unknown',
				okCats: 'Yes',
				okDogs: 'No',
				intakeReason: 'Just a whim.\nAlso, she bit me.',
				oKToShow: false,
				intakeFnFRepr: 'A. Volunteer',
				FVRCP1: undefined,
				FVRCP2: undefined,
				FVRCP3: undefined,
				receivedFVRCPVax: uynChoicesYes,
				fvrcpExpirationDate: '2025-02-09',
				receivedRabiesVax: uynChoicesUnknown,
				rabiesExpirationDate: undefined,
				hairLength: 'short and long',
				currentWeight: '',
				estMatureSize: '',
				distinctiveFeatures: '',
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
				locationOfRescue: 'Somewhere in northern NM',
				descriptionOfRescue: '',
				shelterNum: '',
				shelterPrevID: '',
				courtesyListingNoRelinquishment: false,
				wantsMomBack: false
			}
		}

		const pathname = path.join(process.cwd(), 'data/out/example_stray_surrender.pdf')
		await saveStraySurrenderPDF(info, pathname)
		console.warn('This is an interactive test.')
		console.warn('To evaluate the results, examine %o', pathname)
	})
})
