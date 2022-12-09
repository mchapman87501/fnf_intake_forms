<script lang="ts">
	import { onMount } from 'svelte'

	import { catPkg } from '../infrastructure/stores.js'
	import { getInfoAsCSV } from '../infrastructure/UtilFns.svelte'
	import { initSession, setSurrenderType } from '../infrastructure/StoreFns.svelte'
	import { surrenderChoiceStray } from '../infrastructure/Definitions.svelte'


	import ReceivedFromDriversLic from '../components/ReceivedFromDriversLic.svelte'
	import ReceivedFromName from '../components/ReceivedFromName.svelte'
	import ReceivedFromContactInfo from '../components/ReceivedFromContactInfo.svelte'
	import ReceivedBy from '../components/ReceivedBy.svelte'
	import BreedColorMarkings from '../components/BreedColorMarkings.svelte'
	import IntakeDate from '../components/IntakeDate.svelte'
	import RescueLocation from '../components/RescueLocation.svelte'
	import Donation from '../components/Donation.svelte'

	onMount(() => {
		initSession()
		setSurrenderType(surrenderChoiceStray)
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
	<ReceivedFromDriversLic /><br/>
	<ReceivedFromContactInfo />
	<hr />
	<RescueLocation/><br/>
	<BreedColorMarkings />
	
	<input type="text" placeholder="Tame/Feral" bind:value={$catPkg.tameFeral} /> <br />

	<span>Illness or injuries observed</span><br />
	<textarea bind:value={$catPkg.illnessInjuryObs} /><br />
	<span>Personality observed</span><br />
	<textarea bind:value={$catPkg.personalityObs} /><br />
	<span>Notes</span><br />
	<textarea bind:value={$catPkg.strayNotes} /><br />
	
	<Donation />
	<ReceivedBy />
	<span>Intake Notes</span><br />
	<textarea bind:value={$catPkg.intakeNotes} /><br />

	<hr />

	<div class="btns">
		<button type="submit" disabled={!formValid}>Submit</button>
		<button type="button" on:click={copyFormToClipboard}
			>Copy Surrender Form to Clipboard (Excel)</button
		>
	</div>
</form>

<style>
	input:invalid,
	textarea:invalid {
		color: red;
	}
	span {
		font-size: 75%;
	}

	textarea {
		width: 90%;
	}
	.btns {
		text-align: center;
	}
</style>
