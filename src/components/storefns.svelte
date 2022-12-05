<script lang="ts" context="module">
	import { catPkg, firstRun} from './stores'
	import { get } from 'svelte/store'
	import { uynChoices, genderChoices, alteredChoices } from './Definitions.svelte'
	import { todayStr } from './UtilFns.svelte'
	export function initSession() {
		console.log("init")
		if ( get(firstRun)) {
			console.log("Setting")
			initializecatPkg()
			firstRun.set(false)
		}
		
		
	}

	export function initializecatPkg() {
		console.log("initializecatPkg")
		let temp = get(catPkg)
		temp.recdFromName = ''
		temp.recdFromPhone = ''
		temp.recdFromEmail = ''

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

		catPkg.set(temp)
	}
</script>
