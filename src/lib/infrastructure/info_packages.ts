import { uynChoicesUnknown } from './Definitions.svelte'

export type ReceivedFromPkg = {
	fromName: string
	driversLic: string
	address: string
	city: string
	state: string
	zip: string
	phone: string
	textOK: boolean
	email: string
	donationAmount: string
	donationForm: string
	surrenderType: string
	locationOfRescue: string
	descriptionOfRescue: string
	shelterNum: string
	shelterPrevID: string
	courtesyListingNoRelinquishment: boolean
	wantsMomBack: boolean
}

export type CatPkg = {
	intakeDate: string
	catName: string
	treatableMedical: boolean
	// Issue #19: All dates are optional except DOB.  This type declaration
	// allows all kinds of invalid values, but at least it prohibits undefined.
	DOB: string
	gender: string
	altered: string
	alteredDate: string | undefined
	alteredFacility: string
	breed: string
	color: string
	markings: string
	microchipped: string
	microchipNum: string

	FELVFIVTested: string // Yes/No/Unknown
	FELVFIVPositive: boolean
	FELVFIVTestedDate: string | undefined
	currentShots: boolean
	namePrevVet: string
	phonePrevVet: string
	dietMedications: string
	tameFeral: string
	biteHistory: string // Yes/No/Unknown
	declawed: boolean
	illnessInjuryObs: string
	personalityObs: string
	strayNotes: string
	intakeNotes: string
	specialNeeds: string
	okKinder: string // Yes/No/Unknown
	okCats: string // Yes/No/Unknown
	okDogs: string // Yes/No/Unknown
	intakeReason: string
	oKToShow: boolean
	intakeFnFRepr: string
	FVRCP1: string | undefined
	FVRCP2: string | undefined
	FVRCP3: string | undefined

	receivedRabiesVax: string // Yes/No/Unknown
	rabiesExpirationDate: string | undefined

	receivedFVRCPVax: string // Yes/No/Unknown
	fvrcpExpirationDate: string | undefined

	hairLength: string
	currentWeight: string
	estMatureSize: string
	distinctiveFeatures: string
	temperament: string
	motherLittermates: string
	knownHistory: string
	otherCommentsInternalUseOnly: string
	fosterHomeOnIntake: string
	profilePic: string
}

export type SurrenderPkg = {
	catInfo: CatPkg
	receivedFrom: ReceivedFromPkg
}

export function newReceivedFromPkg(): ReceivedFromPkg {
	return {
		fromName: '',
		driversLic: '',
		address: '',
		city: '',
		state: '',
		zip: '',
		phone: '',
		textOK: true,
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
}

export function newCatPkg(): CatPkg {
	return {
		intakeDate: '',
		catName: '',
		treatableMedical: false,
		DOB: '',
		gender: '',
		altered: '',
		alteredDate: '',
		alteredFacility: '',
		breed: '',
		color: '',
		markings: '',
		microchipped: '',
		microchipNum: '',
		FELVFIVTested: uynChoicesUnknown,
		FELVFIVPositive: false,
		FELVFIVTestedDate: '',
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
		okKinder: '',
		okCats: '',
		okDogs: '',
		intakeReason: '',
		oKToShow: false,
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
}
