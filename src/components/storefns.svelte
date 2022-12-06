<script lang="ts" context="module">
	import { catPkg, firstRun, recvdFromPkg } from './stores'
	import { get } from 'svelte/store'
	import { uynChoices, genderChoices, alteredChoices } from './Definitions.svelte'
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
		temp.homePhone = ''
		temp.email = ''
		temp.address = ''
		temp.city = ''
		temp.dateOfRescue = todayStr()
		temp.descriptionOfRescue = ''
		temp.donationAmount = ''
		temp.donationForm = ''
		temp.driversLic = ''
		temp.locationOfRescue = ''
		temp.shelterNum = ''
		temp.state = ''
		temp.surrenderType = ''
		temp.wantsMomBack = ''
		temp.workCellPhone = ''
		temp.zip = ''
		recvdFromPkg.set(temp)
	}

	export function initializeCatPkg() {
		let temp = get(catPkg)

		temp.intakeFnFRepr = '(F & F representative)'
		temp.intakeReason = ''
		temp.intakeDate = todayStr()

		temp.catName = 'Frank'
		temp.age = ''
		temp.color = ''
		temp.breed = ''

		temp.gender = genderChoices[0]
		temp.altered = alteredChoices[0]

		temp.okKinder = uynChoices[0]
		temp.okCats = uynChoices[0]
		temp.okDogs = false

		temp.specialNeeds = ''
		temp.microchipNum = ''
		temp.FELVFIVPositive = false
		temp.FELVFIVTested = false
		temp.FELVFIVTestedDate = ''

		catPkg.set(temp)
	}
</script>
