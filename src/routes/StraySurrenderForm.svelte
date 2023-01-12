<script lang="ts">
	import { session_token, jwtSession, updateSessionToken } from '$lib/auth/auth'
	import { downloadCompletedForm } from '$lib/api_support/download_info.js'
	import type { SurrenderIntakeInfo } from '$lib/api_support/surrender_and_intake_info.js'
	import LoginDialog, { showLogin } from '$lib/components/LoginDialog.svelte'

	import { catPkg, recvdFromPkg } from '../infrastructure/stores.js'

	import ReceivedFromDriversLic from '../components/ReceivedFromDriversLic.svelte'
	import ReceivedFromName from '../components/ReceivedFromName.svelte'
	import ReceivedFromContactInfo from '../components/ReceivedFromContactInfo.svelte'
	import ReceivedBy from '../components/ReceivedBy.svelte'
	import BreedColorMarkings from '../components/BreedColorMarkings.svelte'
	import IntakeDate from '../components/IntakeDate.svelte'
	import RescueLocation from '../components/RescueLocation.svelte'
	import Donation from '../components/Donation.svelte'
	import SurrenderType from '../components/SurrenderType.svelte'

	async function handleSubmit() {
		const bearerToken = $session_token
		if (bearerToken == null) {
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
			headers: { ...jwtSession(), 'Content-Type': 'application/json' },
			body: bodyJSON
		})

		if (response.status == 401) {
			// Unauthorized, or session has expired. -- need to redirect to login.
			showLogin('Your session has expired.')
		} else if (response.status == 200) {
			updateSessionToken(response)

			const info = (await response.json()) as SurrenderIntakeInfo
			await downloadCompletedForm(info.surrender)
			await downloadCompletedForm(info.intake)
		}
	}

	let formValid = false
	function getFormValid() {
		return true
	}
	$: formValid = getFormValid()
</script>

<LoginDialog />

<form on:submit|preventDefault={handleSubmit}>
	<IntakeDate />
	<SurrenderType /><br />
	<ReceivedFromName />
	<ReceivedFromDriversLic /><br />
	<ReceivedFromContactInfo />
	<hr />
	<RescueLocation /><br />
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
