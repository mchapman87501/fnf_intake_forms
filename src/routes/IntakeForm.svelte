<script lang="ts">
	import { onMount } from 'svelte'

	import { catPkg, recvdFromPkg } from '../components/stores.js'

	import Dropdown from '../components/Dropdown.svelte'
	import Radiobuttons from '../components/Radiobuttons.svelte'
	import {
		uynChoices,
		genderChoices,
		alteredChoices,
		surrenderChoices,
		surrenderChoiceTransfer
	} from '../components/Definitions.svelte'
	import { initSession } from '../components/StoreFns.svelte'
	import { getInfoAsCSV } from '../components/UtilFns.svelte'

	import OkWith from '../components/OkWith.svelte'
	import ReceivedFrom from '../components/ReceivedFrom.svelte'
	import CatnameDobGenderAltered from '../components/CatnameDOBGenderAltered.svelte'
	import BreedColorMarkings from '../components/BreedColorMarkings.svelte'
	import Microchip from '../components/Microchip.svelte'
	import IntakeReason from '../components/IntakeReason.svelte'

	function catPkgHeadersIntake() {
		return [
			'Recvd From Name',
			'Recvd From Phone',
			'Recvd From Email',
			'Intake Reason',
			'Surrender/Stray/Transfer',
			'Shelter Num',
			'Relinq/Courtesy Listing',
			'Show or Web Only',
			'Rescue ID',
			'Cat Name',
			'Cat Age/DOB',
			'Gender',
			'Altered/Intact',
			'Breed',
			'Hair length',
			// readability marker
			'Color',
			'Current Weight',
			'Est Size at Maturity',
			'Distinctive Features',
			'Spay/Neuter Date',
			'Spay/Neuter Facility',
			'RVRCP#1',
			'RVRCP#2',
			'RVRCP#3',
			// readability marker
			'Rabies Expires',
			'FELV/FIV Test Date',
			'FELV/FIV Pos/Neg',
			'Microchip Num',
			'Ok with Kids',
			'Ok with Dogs',
			'Ok with Cats',
			'Bite History',
			'Declawed',
			'Special Needs',
			'Temperament',
			'Mother/Littermates',
			'Known History',
			'Internal-other Comments',
			'Foster Home upon Intake'
		]
	}
	function catPkgValuesIntake() {
		return [
			$recvdFromPkg.fromName,
			$recvdFromPkg.homePhone,
			$recvdFromPkg.email,
			$catPkg.intakeReason,
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			'FigureThis',
			$catPkg.catName,
			$catPkg.age,
			$catPkg.gender,
			$catPkg.altered,
			$catPkg.breed,
			'TBD',
			// readability marker
			$catPkg.color,
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			// readability marker
			'TBD',
			'TBD',
			'TBD',
			$catPkg.microchipNum,
			$catPkg.okKinder,
			$catPkg.okCats,
			$catPkg.okDogs.toString(),
			'TBD',
			'TBD',
			$catPkg.specialNeeds,
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			'TBD foster home'
		]
	}
	function getInfoAsTable(): Array<Array<string>> {
		// Use standard 'yyyy-mm-dd' value format of <input type="date"> -- i.e.,
		// use intakeDate as-is.
		return [catPkgHeadersIntake(), catPkgValuesIntake()]
	}
	function copyFormToClipboard() {
		// Copy the CSV table to the clipboard.  From there you can paste into Excel.
		const csvStr = getInfoAsCSV(getInfoAsTable())
		console.log('Copying %o', csvStr)
		navigator.clipboard.writeText(csvStr)
	}

	function handleSubmit() {
		return false // prevent reload
	}

	let formValid = false
	function getFormValid() {
		return true
	}
	$: formValid = getFormValid()
</script>

<form on:submit|preventDefault={handleSubmit}>
	<ReceivedFrom /><br />
	<IntakeReason /><br />
	<Dropdown choiceList={surrenderChoices} bind:value={$recvdFromPkg.surrenderType} /> 
	{#if $recvdFromPkg.surrenderType == surrenderChoiceTransfer}
		<input type="text" placeholder={'Shelter ID'} bind:value={$recvdFromPkg.shelterNum} />
	{/if}
	<br />
	<CatnameDobGenderAltered /><br />
	<BreedColorMarkings /><br />
	<Microchip /><br />

	<OkWith /><br />

	<span>Special needs/habits:</span><br />
	<textarea bind:value={$catPkg.specialNeeds} /><br />

	<div class="btns">
		<button type="submit" disabled={!formValid}>Submit</button>
		<button type="button" on:click={copyFormToClipboard}
			>Copy Intake Form to Clipboard (Excel)</button
		>
	</div>
</form>

<style>
	.btns {
		text-align: center;
	}
	label {
		font-size: 75%;
	}
</style>
