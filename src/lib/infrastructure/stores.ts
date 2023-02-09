import { uynChoices } from './Definitions.svelte'
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
	FELVFIVTested: false,
	FELVFIVPositive: false,
	FELVFIVTestedDate: undefined,
	currentShots: false,
	namePrevVet: '',
	phonePrevVet: '',
	dietMedications: '',
	tameFeral: '',
	biteHistory: uynChoices[0],
	declawed: false,
	illnessInjuryObs: '',
	personalityObs: '',
	strayNotes: '',
	intakeNotes: '',
	specialNeeds: '',
	okKinder: uynChoices[0],
	okCats: uynChoices[0],
	okDogs: uynChoices[0],
	intakeReason: '',
	oKToShow: true,
	intakeFnFRepr: '',
	FVRCP1: undefined,
	FVRCP2: undefined,
	FVRCP3: undefined,
	rabiesExpirationDate: undefined,
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
