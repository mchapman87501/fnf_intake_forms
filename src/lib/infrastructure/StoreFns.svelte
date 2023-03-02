<script lang="ts" context="module">
	import { catPkg, firstRun, recvdFromPkg } from './stores'
	import { get } from 'svelte/store'
	import {
		uynChoicesUnknown,
		genderChoices,
		surrenderChoices,
		feralChoicesUnknown
	} from '$lib/infrastructure/Definitions.svelte'
	import { todayStr } from './UtilFns.svelte'

	export function initForms() {
		initializeCatPkg()
		initializeRecvdFromPkg()
	}

	export function cloneForm() {
		initializeCatPkg()
	}

	export function initSession() {
		if (get(firstRun)) {
			initForms()
			firstRun.set(false)
		}
	}
	export function setSurrenderType(val: string) {
		let temp = get(recvdFromPkg)
		temp.surrenderType = val
		recvdFromPkg.set(temp)
	}
	export function initializeRecvdFromPkg() {
		let temp = get(recvdFromPkg)
		temp.fromName = ''
		temp.driversLic = ''
		temp.address = ''
		temp.city = ''
		temp.state = ''
		temp.zip = ''
		temp.phone = ''
		temp.textOK = false
		temp.email = ''

		temp.donationAmount = ''
		temp.donationForm = ''

		temp.surrenderType = surrenderChoices[0]
		temp.locationOfRescue = ''
		temp.shelterPrevID = ''
		temp.descriptionOfRescue = ''
		temp.shelterNum = ''
		temp.courtesyListingNoRelinquishment = false
		temp.wantsMomBack = false

		recvdFromPkg.set(temp)
	}

	export function initializeCatPkg() {
		let temp = get(catPkg)

		temp.intakeDate = todayStr()

		temp.catName = ''
		temp.treatableMedical = false
		temp.DOB = ''
		temp.gender = genderChoices[0]
		temp.altered = uynChoicesUnknown
		temp.alteredDate = undefined
		temp.alteredFacility = ''
		temp.breed = ''
		temp.color = ''
		temp.markings = ''
		temp.microchipped = uynChoicesUnknown
		temp.microchipNum = ''

		temp.FELVFIVPositive = false
		temp.FELVFIVTested = uynChoicesUnknown
		temp.FELVFIVTestedDate = undefined
		temp.currentShots = false
		temp.namePrevVet = ''
		temp.phonePrevVet = ''
		temp.dietMedications = ''
		temp.tameFeral = feralChoicesUnknown
		temp.biteHistory = uynChoicesUnknown
		temp.declawed = false
		temp.illnessInjuryObs = ''
		temp.personalityObs = ''
		temp.strayNotes = ''
		temp.intakeNotes = ''

		temp.specialNeeds = ''
		temp.okKinder = uynChoicesUnknown
		temp.okCats = uynChoicesUnknown
		temp.okDogs = uynChoicesUnknown

		temp.intakeReason = ''
		temp.oKToShow = true
		temp.intakeFnFRepr = ''
		temp.FVRCP1 = undefined
		temp.FVRCP2 = undefined
		temp.FVRCP3 = undefined
		temp.rabiesExpirationDate = ''
		temp.hairLength = ''
		temp.currentWeight = ''
		temp.estMatureSize = ''
		temp.distinctiveFeatures = ''
		temp.temperament = ''
		temp.motherLittermates = ''
		temp.knownHistory = ''
		temp.otherCommentsInternalUseOnly = ''
		temp.fosterHomeOnIntake = ''
		temp.profilePic = ''

		temp.hairLength = ''
		temp.currentWeight = ''
		temp.estMatureSize = ''
		temp.distinctiveFeatures = ''
		temp.temperament = ''
		temp.motherLittermates = ''
		temp.knownHistory = ''
		temp.otherCommentsInternalUseOnly = ''
		temp.fosterHomeOnIntake = ''

		catPkg.set(temp)
	}
</script>
