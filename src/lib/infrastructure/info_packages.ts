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
	FELVFIVTested: boolean
	FELVFIVPositive: boolean
	FELVFIVTestedDate: string | undefined
	currentShots: boolean
	namePrevVet: string
	phonePrevVet: string
	dietMedications: string
	tameFeral: string
	biteHistory: boolean
	declawed: boolean
	illnessInjuryObs: string
	personalityObs: string
	strayNotes: string
	intakeNotes: string
	specialNeeds: string
	okKinder: string
	okCats: string
	okDogs: string
	intakeReason: string
	oKToShow: boolean
	intakeFnFRepr: string
	FVRCP1: string | undefined
	FVRCP2: string | undefined
	FVRCP3: string | undefined
	rabiesExpirationDate: string | undefined
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
		FELVFIVTested: false,
		FELVFIVPositive: false,
		FELVFIVTestedDate: '',
		currentShots: false,
		namePrevVet: '',
		phonePrevVet: '',
		dietMedications: '',
		tameFeral: '',
		biteHistory: false,
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
		FVRCP1: '',
		FVRCP2: '',
		FVRCP3: '',
		rabiesExpirationDate: '',
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
