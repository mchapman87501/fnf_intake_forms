<script lang="ts">
	import { onMount } from 'svelte'
	import { session_username } from '$lib/auth'
	import { downloadCompletedForm } from '$lib/api_support/download_info.js'
	import type { SurrenderDownloads } from '$lib/api_support/surrender_and_intake_info.js'
	import LoginDialog, { showLogin } from '$lib/components/LoginDialog.svelte'

	import { catPkg, recvdFromPkg } from '$lib/infrastructure/stores'

	import ReceivedFromDriversLic from '$lib/components/ReceivedFromDriversLic.svelte'
	import ReceivedFromName from '$lib/components/ReceivedFromName.svelte'
	import ReceivedFromContactInfo from '$lib/components/ReceivedFromContactInfo.svelte'
	import ReceivedBy from '$lib/components/ReceivedBy.svelte'
	import BreedColorMarkings from '$lib/components/BreedColorMarkings.svelte'
	import IntakeDate from '$lib/components/IntakeDate.svelte'
	import RescueLocation from '$lib/components/RescueLocation.svelte'
	import Donation from '$lib/components/Donation.svelte'
	import { surrenderChoiceStray } from '$lib/infrastructure/Definitions.svelte'
	import BiteHistory from '$lib/components/BiteHistory.svelte'
	import VaccinesAndDiseaseTests from '$lib/components/VaccinesAndDiseaseTests.svelte'

	async function handleSubmit() {
		const username = $session_username || ''
		if (username == '') {
			showLogin('You must be logged in to submit a form.')
			return
		}

		const bodyData = {
			catInfo: $catPkg,
			receivedFrom: $recvdFromPkg
		}
		const bodyJSON = JSON.stringify(bodyData)
		// TODO move backend communications like this to src/lib.
		const response = await fetch('/api/v1/stray_surrender_form', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: bodyJSON
		})

		if (response.status == 401) {
			// Unauthorized, or session has expired. -- need to redirect to login.
			showLogin('Your session has expired.')
		} else if (response.status == 200) {
			const info = (await response.json()) as SurrenderDownloads
			await downloadCompletedForm(info.surrender)
			await downloadCompletedForm(info.intake)
			if (info.surrenderPDF !== undefined) {
				await downloadCompletedForm(info.surrenderPDF)
			}
		}
	}

	let formValid = false
	function getFormValid() {
		return true
	}
	$: formValid = getFormValid()

	onMount(() => {
		$recvdFromPkg.surrenderType = surrenderChoiceStray
	})
</script>

<LoginDialog />

<form on:submit|preventDefault={handleSubmit}>
	<IntakeDate /><br />
	<ReceivedFromName />
	<ReceivedFromDriversLic /><br />
	<ReceivedFromContactInfo />
	<hr />
	<RescueLocation /><br />
	<BreedColorMarkings />
	<VaccinesAndDiseaseTests />

	<input type="text" placeholder="Tame/Feral" bind:value={$catPkg.tameFeral} /> <br />

	<span>Illness or injuries observed</span><br />
	<textarea bind:value={$catPkg.illnessInjuryObs} /><br />

	<br />
	<BiteHistory /><br /><br />
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
		<button
			type="submit"
			disabled={!formValid}
			title="Save this stray surrender form and download the resulting intake form."
		>
			Download Intake Form
		</button>
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

	:global(input) {
		margin: 0.25em 0;
	}
</style>
