<script lang="ts" context="module">
	import { catPkg, firstRun, recvdFromPkg } from './stores'
	import { get } from 'svelte/store'
	import { uynChoices, genderChoices, alteredChoices, surrenderChoices, okKidsChoices, okCatsChoices, microchippedChoices } from './Definitions.svelte'
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

	export function initializeRecvdFromPkg() {
		let temp = get(recvdFromPkg)
		temp.fromName = ''
		temp.driversLic = ''
		temp.address = ''
		temp.homePhone = ''
		temp.city = ''
		temp.state = ''
		temp.zip = ''
		temp.workCellPhone = ''
		temp.email = ''

		temp.donationAmount = ''
		temp.donationForm = ''

		temp.surrenderType = surrenderChoices[0]
		temp.dateOfRescue = todayStr()
		temp.locationOfRescue = ''
		temp.descriptionOfRescue = ''
		temp.shelterNum = ''
		temp.wantsMomBack = ''
		
		recvdFromPkg.set(temp)
	}

	export function initializeCatPkg() {
		let temp = get(catPkg)
	
		temp.intakeDate = todayStr()

		temp.catName = ''
		temp.age = ''
		temp.gender = genderChoices[0]
		temp.altered = alteredChoices[0]
		temp.breed = ''
		temp.color = ''
		temp.markings = ''
		temp.microchipped = microchippedChoices[0]
		temp.microchipNum = ''

		temp.FELVFIVPositive = false
		temp.FELVFIVTested = false
		temp.FELVFIVTestedDate = ''
		temp.currentShots = false 
		temp.namePrevVet= ''
		temp.phonePrevVet= ''
		temp.dietMedications= ''
		temp.tameFeral= ''
		temp.illnessInjuryObs= ''
		temp.personalityObs= ''
		temp.strayNotes= ''
		temp.intakeNotes= ''


		temp.specialNeeds = ''
		temp.okKinder = okKidsChoices[0]
		temp.okCats = okCatsChoices[0]
		temp.okDogs = false

		temp.intakeReason = ''
		temp.intakeFnFRepr = '(F & F representative)'
		catPkg.set(temp)
	}
</script>
