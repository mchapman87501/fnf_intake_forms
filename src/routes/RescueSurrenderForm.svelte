<script lang="ts">
	import { session_username } from '$lib/auth'
	import { downloadCompletedForm } from '$lib/api_support/download_info.js'
	import type { SurrenderDownloads } from '$lib/api_support/surrender_and_intake_info.js'
	import LoginDialog, { showLogin } from '$lib/components/LoginDialog.svelte'

	import ReceivedFromName from '$lib/components/ReceivedFromName.svelte'
	import ReceivedFromDriversLic from '$lib/components/ReceivedFromDriversLic.svelte'
	import ReceivedFromContactInfo from '$lib/components/ReceivedFromContactInfo.svelte'
	import BreedColorMarkings from '$lib/components/BreedColorMarkings.svelte'
	import OkWith from '$lib/components/OkWith.svelte'
	import RescueLocation from '$lib/components/RescueLocation.svelte'
	import Donation from '$lib/components/Donation.svelte'
	import IntakeDate from '$lib/components/IntakeDate.svelte'
	import PrevShelterInfo from '$lib/components/PrevShelterInfo.svelte'
	import CourtesyListingNoRelinquishment from '$lib/components/CourtesyListingNoRelinquishment.svelte'
	import ShowNotWebOnly from '$lib/components/ShowNotWebOnly.svelte'
	import { onMount } from 'svelte'
	import { surrenderChoiceRescue } from '$lib/infrastructure/Definitions.svelte'
	import { catPkg, recvdFromPkg } from '$lib/infrastructure/stores'
	import BiteHistory from '$lib/components/BiteHistory.svelte'
	import VaccinesAndDiseaseTests from '$lib/components/VaccinesAndDiseaseTests.svelte'
	import VetInfo from '$lib/components/VetInfo.svelte'
	import DownloadFormsBtn from '$lib/components/DownloadFormsBtn.svelte'
	import CatName from '$lib/components/CatName.svelte'
	import CatDob from '$lib/components/CatDOB.svelte'
	import CatGender from '$lib/components/CatGender.svelte'
	import AlteredWhenWhere from '$lib/components/AlteredWhenWhere.svelte'
	import CatFeralStatus from '$lib/components/CatFeralStatus.svelte'

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
		const response = await fetch('/api/v1/rescue_surrender_form', {
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

	onMount(() => {
		$recvdFromPkg.surrenderType = surrenderChoiceRescue
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
	</fieldset>

	<fieldset>
		<legend>Physical</legend>
		<div>
			<CatName />
			<CatDob />
			<CatGender />
		</div>
		<AlteredWhenWhere />
		<BreedColorMarkings />
		<CatFeralStatus />
		<VaccinesAndDiseaseTests />
		<VetInfo />
	</fieldset>

	<fieldset>
		<legend>Social</legend>
		<BiteHistory />
		<OkWith />
	</fieldset>

	<fieldset>
		<legend>Rescue</legend>
		<RescueLocation />
		<PrevShelterInfo />
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
