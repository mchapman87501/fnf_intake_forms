<script lang="ts" context="module">
	import { catPkg, firstRun, recvdFromPkg } from './stores'
	import { get } from 'svelte/store'
	import {
		uynChoices,
		genderChoices,
		surrenderChoices
	} from './Definitions.svelte'
	import { todayStr } from './UtilFns.svelte'

	export function initForms() {
		initializeCatPkg()
		initializeRecvdFromPkg()
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
		temp.DOB = `2000-01-01`
		temp.gender = genderChoices[0]
		temp.altered = uynChoices[0]
		temp.alteredDate =`2000-01-01`
		temp.alteredFacility =''
		temp.breed = ''
		temp.color = ''
		temp.markings = ''
		temp.microchipped = uynChoices[0]
		temp.microchipNum = ''

		temp.FELVFIVPositive = false
		temp.FELVFIVTested = false
		temp.FELVFIVTestedDate = `2000-01-01`
		temp.currentShots = false
		temp.namePrevVet = ''
		temp.phonePrevVet = ''
		temp.dietMedications = ''
		temp.tameFeral = ''
		temp.biteHistory = false
		temp.declawed = false
		temp.illnessInjuryObs = ''
		temp.personalityObs = ''
		temp.strayNotes = ''
		temp.intakeNotes = ''

		temp.specialNeeds = ''
		temp.okKinder = uynChoices[0]
		temp.okCats = uynChoices[0]
		temp.okDogs = uynChoices[0]

		temp.intakeReason = ''
		temp.oKToShow = true
		temp.intakeFnFRepr = '(F & F representative)'
		catPkg.set(temp)
	}
</script>
