<script lang="ts">
	import { onMount } from 'svelte'
	import { session_token, jwtSession, updateSessionToken } from '$lib/auth'
	import { downloadCompletedForm } from '$lib/api_support/download_info.js'
	import type { SurrenderDownloads } from '$lib/api_support/surrender_and_intake_info.js'
	import LoginDialog, { showLogin } from '$lib/components/LoginDialog.svelte'

	import { catPkg, recvdFromPkg } from '$lib/infrastructure/stores.js'

	import ReceivedFromDriversLic from '$lib/components/ReceivedFromDriversLic.svelte'
	import ReceivedFromName from '$lib/components/ReceivedFromName.svelte'
	import ReceivedFromContactInfo from '$lib/components/ReceivedFromContactInfo.svelte'
	import ReceivedBy from '$lib/components/ReceivedBy.svelte'
	import IntakeDate from '$lib/components/IntakeDate.svelte'
	import CatnameDOBGenderAltered from '$lib/components/CatnameDOBGenderAltered.svelte'
	import BreedColorMarkings from '$lib/components/BreedColorMarkings.svelte'
	import Microchip from '$lib/components/Microchip.svelte'
	import ShotsFivTestedVetInfo from '$lib/components/ShotsFIVTestedVetInfo.svelte'
	import OkWith from '$lib/components/OkWith.svelte'
	import IntakeReason from '$lib/components/IntakeReason.svelte'
	import Donation from '$lib/components/Donation.svelte'
	import CourtesyListingNoRelinquishment from '$lib/components/CourtesyListingNoRelinquishment.svelte'
	import TreatableMedical from '$lib/components/TreatableMedical.svelte'
	import ShowNotWebOnly from '$lib/components/ShowNotWebOnly.svelte'
	import { surrenderChoiceSurrender } from '$lib/infrastructure/Definitions.svelte'

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
		const response = await fetch('/api/v1/owner_surrender_form', {
			method: 'POST',
			headers: { ...jwtSession(), 'Content-Type': 'application/json' },
			body: bodyJSON
		})

		if (response.status == 401) {
			// Unauthorized, or session has expired. -- need to redirect to login.
			showLogin('Your session has expired.')
		} else if (response.status == 200) {
			updateSessionToken(response)

			const info = (await response.json()) as SurrenderDownloads
			await downloadCompletedForm(info.surrender)
			await downloadCompletedForm(info.intake)
			await downloadCompletedForm(info.intakeSingleRow)
		}
	}

	let formValid = false
	function getFormValid() {
		return true
	}
	$: formValid = getFormValid()

	onMount(() => {
		$recvdFromPkg.surrenderType = surrenderChoiceSurrender
	})
</script>

<LoginDialog />

<form on:submit|preventDefault={handleSubmit}>
	<IntakeDate /><br />
	<ReceivedFromName />
	<ReceivedFromDriversLic /> <br />
	<ReceivedFromContactInfo />
	<template id="mom-paragraph"><p><slot name="mom-slot" /></p></template>
	<hr />

	<CatnameDOBGenderAltered /><br />
	<BreedColorMarkings /><br />
	<Microchip /><br />
	<ShotsFivTestedVetInfo /><br />
	<OkWith /><br />
	<IntakeReason /><br />
	<CourtesyListingNoRelinquishment />
	<TreatableMedical />
	<ShowNotWebOnly />
	<hr />
	<Donation />
	<ReceivedBy />

	<hr />

	<div class="btns">
		<button
			type="submit"
			disabled={!formValid}
			title="Save this surrender form and download the resulting intake form."
		>
			Download Intake Form
		</button>
	</div>
</form>

<style>
	:global(input) {
		margin: 0.25em 0;
	}
</style>
