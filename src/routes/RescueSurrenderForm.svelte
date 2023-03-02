<script lang="ts">
	import LoginDialog from '$lib/components/LoginDialog.svelte'

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
	import { recvdFromPkg } from '$lib/infrastructure/stores'
	import BiteHistory from '$lib/components/BiteHistory.svelte'
	import VaccinesAndDiseaseTests from '$lib/components/VaccinesAndDiseaseTests.svelte'
	import VetInfo from '$lib/components/VetInfo.svelte'
	import DownloadFormsBtn, { handleSubmit } from '$lib/components/DownloadFormsBtn.svelte'
	import CatName from '$lib/components/CatName.svelte'
	import CatDob from '$lib/components/CatDOB.svelte'
	import CatGender from '$lib/components/CatGender.svelte'
	import AlteredWhenWhere from '$lib/components/AlteredWhenWhere.svelte'
	import CatFeralStatus from '$lib/components/CatFeralStatus.svelte'
	import IntakeNotes from '$lib/components/IntakeNotes.svelte'

	onMount(() => {
		$recvdFromPkg.surrenderType = surrenderChoiceRescue
	})

	async function submitForm() {
		handleSubmit('/api/v1/rescue_surrender_form')
	}
</script>

<LoginDialog />

<form on:submit|preventDefault={submitForm}>
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
		<IntakeNotes />
		<Donation />
	</fieldset>

	<DownloadFormsBtn />
</form>

<style>
	:global(input) {
		margin: 0.25em 0;
	}
</style>
