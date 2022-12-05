<script lang="ts" context="module">
	import { catInfo, catInfoPkg } from './stores'
	import { get } from 'svelte/store'
	import { uynChoices, genderChoices, alteredChoices } from '../components/definitions.svelte'
	import { todayStr } from './UtilFns.svelte'


	export function initializeCatInfoPkg() {
		let temp = get(catInfoPkg)
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

		catInfoPkg.set(temp)
	}

	export function setOKKinder(val: string) {
		let temp = get(catInfoPkg)
		temp.okKinder = val
		catInfoPkg.set(temp)
	}
</script>
