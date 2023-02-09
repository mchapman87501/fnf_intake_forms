import { uynChoicesUnknown } from './Definitions.svelte'
import type { CatPkg, ReceivedFromPkg } from './info_packages'
import { writable } from 'svelte/store'

// Initialize on mount on first run only
// The user clears the forms after that
export const firstRun = writable(true)

// Information about the party from
// whom the cat was received

let recvdFrom: ReceivedFromPkg = {
	fromName: '',
	driversLic: '',
	address: '',
	city: '',
	state: '',
	zip: '',
	phone: '',
	textOK: false,
	email: '',
	donationAmount: '',
	donationForm: '',
	surrenderType: '',
	locationOfRescue: '',
	descriptionOfRescue: '',
	shelterNum: '',
	shelterPrevID: '',
	courtesyListingNoRelinquishment: false,
	wantsMomBack: false
}
export const recvdFromPkg = writable(recvdFrom)

// Information about the cat
let cat: CatPkg = {
	intakeDate: '',
	catName: '',
	treatableMedical: false,
	DOB: '',
	gender: '',
	altered: '',
	alteredDate: undefined,
	alteredFacility: '',
	breed: '',
	color: '',
	markings: '',
	microchipped: '',
	microchipNum: '',
	FELVFIVTested: uynChoicesUnknown,
	FELVFIVPositive: false,
	FELVFIVTestedDate: undefined,
	currentShots: false,
	namePrevVet: '',
	phonePrevVet: '',
	dietMedications: '',
	tameFeral: '',
	biteHistory: uynChoicesUnknown,
	declawed: false,
	illnessInjuryObs: '',
	personalityObs: '',
	strayNotes: '',
	intakeNotes: '',
	specialNeeds: '',
	okKinder: uynChoicesUnknown,
	okCats: uynChoicesUnknown,
	okDogs: uynChoicesUnknown,
	intakeReason: '',
	oKToShow: true,
	intakeFnFRepr: '',

	receivedRabiesVax: uynChoicesUnknown,
	rabiesExpirationDate: undefined,

	// TODO resolve UI/model inconsistency.
	// Issue #29 suggests a single date for FVRCP expiration,
	// but intake form shows there are three separate doses for
	// this vaccine.
	FVRCP1: undefined,
	FVRCP2: undefined,
	FVRCP3: undefined,
	receivedFVRCPVax: uynChoicesUnknown,
	fvrcpExpirationDate: undefined,

	hairLength: '',
	currentWeight: '',
	estMatureSize: '',
	distinctiveFeatures: '',
	temperament: '',
	motherLittermates: '',
	knownHistory: '',
	otherCommentsInternalUseOnly: '',
	fosterHomeOnIntake: '',
	profilePic: ''
}
export const catPkg = writable(cat)
