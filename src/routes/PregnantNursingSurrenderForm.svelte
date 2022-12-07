<script lang="ts">
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'

	import { catPkg, recvdFromPkg } from '../components/stores'
	import { initSession, setSurrenderType } from '../components/StoreFns.svelte'

	import { getInfoAsCSV } from '../components/UtilFns.svelte'

	import ReceivedFrom from '../components/ReceivedFrom.svelte'
	import ReceivedBy from '../components/ReceivedBy.svelte'
	import BreedColorMarkings from '../components/BreedColorMarkings.svelte'
	import CatnameDOBGenderAltered from '../components/CatnameDOBGenderAltered.svelte'
	import ShotsFIVTestedVetInfo from '../components/ShotsFIVTestedVetInfo.svelte'
	import OkWith from '../components/OkWith.svelte'
	import RescueLocation from '../components/RescueLocation.svelte'
	import IntakeDate from '../components/IntakeDate.svelte'
	import Microchip from '../components/Microchip.svelte'
	import Donation from '../components/Donation.svelte'
	import { uynChoices, genderChoiceFemale, surrenderChoiceSurrender } from '../components/Definitions.svelte'

	onMount(() => {
		initSession()
		setSurrenderType(surrenderChoiceSurrender)
	})

	// TODO reflect Surrender form
	function headers() {
		return []
	}
	function values() {
		return []
	}

	function copyFormToClipboard() {
		// Copy the CSV table to the clipboard.  From there you can paste into Excel.
		const csvStr = getInfoAsCSV([headers(), values()])
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
	<IntakeDate/><br/>
	<ReceivedFrom />
	<br>
	<label>
		<input type="checkbox" bind:checked={$recvdFromPkg.wantsMomBack} />
		Wants to re-adopt Mother Cat after kittens are weaned and she has been spayed
	</label>

	<hr />

	<CatnameDOBGenderAltered /><br />
	<BreedColorMarkings /><br />
	<Microchip/><br/>
	<ShotsFIVTestedVetInfo /><br />
	<OkWith /><br />
	<RescueLocation />

	<hr />
	<Donation />
	<ReceivedBy />

	<hr />

	<div class="btns">
		<button type="submit" disabled={!formValid}>Submit</button>
		<button type="button" on:click={copyFormToClipboard}
			>Copy Surrender Form to Clipboard (Excel)</button
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
