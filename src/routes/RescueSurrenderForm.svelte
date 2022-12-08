<script lang="ts">
	import { onMount } from 'svelte'
	import { initSession, setSurrenderType } from '../components/StoreFns.svelte'
	
	import { surrenderChoiceTransfer } from '../components/Definitions.svelte'

	import { getInfoAsCSV } from '../components/UtilFns.svelte'

	import ReceivedFromName from '../components/ReceivedFromName.svelte'
	import ReceivedFromDriversLic from '../components/ReceivedFromDriversLic.svelte'
	import ReceivedFromContactInfo from '../components/ReceivedFromContactInfo.svelte'
	import ReceivedBy from '../components/ReceivedBy.svelte'
	import BreedColorMarkings from '../components/BreedColorMarkings.svelte'
	import CatnameDOBGenderAltered from '../components/CatnameDOBGenderAltered.svelte'
	import ShotsFIVTestedVetInfo from '../components/ShotsFIVTestedVetInfo.svelte'
	import OkWith from '../components/OkWith.svelte'
	import RescueLocation from '../components/RescueLocation.svelte'
	import Donation from '../components/Donation.svelte'
	import IntakeDate from '../components/IntakeDate.svelte'
	import PrevShelterInfo from '../components/PrevShelterInfo.svelte'
	import CourtesyListingNoRelinquishment from '../components/CourtesyListingNoRelinquishment.svelte'
	import TreatableMedical from '../components/TreatableMedical.svelte'
	import ShowNotWebOnly from '../components/ShowNotWebOnly.svelte'

	onMount(() => {
		initSession()
		setSurrenderType(surrenderChoiceTransfer)
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
	<ReceivedFromName />
	<ReceivedFromDriversLic />
	<ReceivedFromContactInfo />
	
	<hr/>
	
	<PrevShelterInfo/>

	<hr />

	<CatnameDOBGenderAltered /><br />
	<BreedColorMarkings /><br />
	<ShotsFIVTestedVetInfo /><br />
	<OkWith /><br />
	<RescueLocation />
	<CourtesyListingNoRelinquishment/>
	<TreatableMedical/>
	<ShowNotWebOnly/>
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
