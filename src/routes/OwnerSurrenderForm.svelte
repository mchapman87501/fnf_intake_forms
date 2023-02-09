<script lang="ts">
	import { onMount } from 'svelte'
	import { session_username } from '$lib/auth'
	import { downloadCompletedForm } from '$lib/api_support/download_info'
	import type { SurrenderDownloads } from '$lib/api_support/surrender_and_intake_info'
	import LoginDialog, { showLogin } from '$lib/components/LoginDialog.svelte'

	import { catPkg, recvdFromPkg } from '$lib/infrastructure/stores'

	import ReceivedFromDriversLic from '$lib/components/ReceivedFromDriversLic.svelte'
	import ReceivedFromName from '$lib/components/ReceivedFromName.svelte'
	import ReceivedFromContactInfo from '$lib/components/ReceivedFromContactInfo.svelte'
	import IntakeDate from '$lib/components/IntakeDate.svelte'
	import CatnameDOBGenderAltered from '$lib/components/CatnameDOBGenderAltered.svelte'
	import BreedColorMarkings from '$lib/components/BreedColorMarkings.svelte'
	import Microchip from '$lib/components/Microchip.svelte'
	import OkWith from '$lib/components/OkWith.svelte'
	import IntakeReason from '$lib/components/IntakeReason.svelte'
	import Donation from '$lib/components/Donation.svelte'
	import CourtesyListingNoRelinquishment from '$lib/components/CourtesyListingNoRelinquishment.svelte'
	import ShowNotWebOnly from '$lib/components/ShowNotWebOnly.svelte'
	import { surrenderChoiceSurrender } from '$lib/infrastructure/Definitions.svelte'
	import BiteHistory from '$lib/components/BiteHistory.svelte'
	import VaccinesAndDiseaseTests from '$lib/components/VaccinesAndDiseaseTests.svelte'
	import VetInfo from '$lib/components/VetInfo.svelte'
	import SpecialNeeds from '$lib/components/SpecialNeeds.svelte'
	import DietAndMedical from '../lib/components/DietAndMedical.svelte'
	import DownloadFormsBtn from '$lib/components/DownloadFormsBtn.svelte'

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
		const response = await fetch('/api/v1/owner_surrender_form', {
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
			await downloadCompletedForm(info.intakeSingleRow)
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
		$recvdFromPkg.surrenderType = surrenderChoiceSurrender
	})
</script>

<LoginDialog />

<form on:submit|preventDefault={handleSubmit}>
	<fieldset>
		<legend>Contact</legend>
		<IntakeDate /><br />
		<ReceivedFromName />
		<ReceivedFromDriversLic /> <br />
		<ReceivedFromContactInfo />
		<template id="mom-paragraph"><div><slot name="mom-slot" /></div></template>
	</fieldset>

	<fieldset>
		<legend>Physical</legend>
		<CatnameDOBGenderAltered />
		<div>
			<BreedColorMarkings />
		</div>
		<VaccinesAndDiseaseTests />
		<Microchip />
		<VetInfo />
		<DietAndMedical />
		<SpecialNeeds />
	</fieldset>

	<fieldset>
		<legend>Social</legend>
		<div>
			<BiteHistory />
			<OkWith />
		</div>
		<IntakeReason />
	</fieldset>

	<fieldset>
		<legend>Intake</legend>
		<CourtesyListingNoRelinquishment />
		<ShowNotWebOnly />

		<Donation />
	</fieldset>

	<DownloadFormsBtn />
</form>

<style>
	:global(input) {
		margin: 0.25em 0;
	}
</style>
