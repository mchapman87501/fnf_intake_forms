<script lang="ts">
	import { onMount } from 'svelte'
	import { initSession, setSurrenderType } from '../components/StoreFns.svelte'
	import { recvdFromPkg, catPkg } from '../components/stores'
	
	import { relinquishCourtesyChoices, surrenderChoiceTransfer } from '../components/Definitions.svelte'

	import { getInfoAsCSV } from '../components/UtilFns.svelte'

	import Dropdown from '../components/Dropdown.svelte'
	import ReceivedFrom from '../components/ReceivedFrom.svelte'
	import ReceivedBy from '../components/ReceivedBy.svelte'
	import BreedColorMarkings from '../components/BreedColorMarkings.svelte'
	import CatnameDobGenderAltered from '../components/CatnameDOBGenderAltered.svelte'
	import ShotsFIVTestedVetInfo from '../components/ShotsFIVTestedVetInfo.svelte'
	import OkWith from '../components/OkWith.svelte'
	import RescueDateLocation from '../components/RescueDateLocation.svelte'
	import Donation from '../components/Donation.svelte'
	import IntakeDate from '../components/IntakeDate.svelte'

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
	<ReceivedFrom />
	
	<hr/>
	
	<label>
		<input
			type="text"
			placeholder="Shelter Number:"
			bind:value={$recvdFromPkg.shelterNum}
		/>
	</label>
	<Dropdown choiceList={relinquishCourtesyChoices} bind:value={$recvdFromPkg.relinquishCourtesyListing}/>
	<hr />

	<CatnameDobGenderAltered /><br />
	<BreedColorMarkings /><br />
	<ShotsFIVTestedVetInfo /><br />
	<OkWith /><br />
	<RescueDateLocation />

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
