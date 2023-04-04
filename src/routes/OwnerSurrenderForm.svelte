<script lang="ts">
	import { onMount } from 'svelte'
	import LoginDialog from '$lib/components/LoginDialog.svelte'

	import { catPkg, recvdFromPkg } from '$lib/infrastructure/stores'
	import { genderChoiceFemale, uynChoicesNo } from '$lib/infrastructure/Definitions.svelte'

	import ReceivedFromDriversLic from '$lib/components/ReceivedFromDriversLic.svelte'
	import ReceivedFromName from '$lib/components/ReceivedFromName.svelte'
	import ReceivedFromContactInfo from '$lib/components/ReceivedFromContactInfo.svelte'
	import IntakeDate from '$lib/components/IntakeDate.svelte'
	import BreedColorMarkings from '$lib/components/BreedColorMarkings.svelte'
	import Microchip from '$lib/components/Microchip.svelte'
	import OkWith from '$lib/components/OkWith.svelte'
	import IntakeReason from '$lib/components/IntakeReason.svelte'
	import Donation from '$lib/components/Donation.svelte'
	import CourtesyListingNoRelinquishment from '$lib/components/CourtesyListingNoRelinquishment.svelte'
	import ShowNotWebOnly from '$lib/components/ShowNotWebOnly.svelte'
	import { surrenderChoicePregnant, surrenderChoiceSurrender } from '$lib/infrastructure/Definitions.svelte'
	import BiteHistory from '$lib/components/BiteHistory.svelte'
	import VaccinesAndDiseaseTests from '$lib/components/VaccinesAndDiseaseTests.svelte'
	import VetInfo from '$lib/components/VetInfo.svelte'
	import SpecialNeeds from '$lib/components/SpecialNeeds.svelte'
	import DietAndMedical from '../lib/components/DietAndMedical.svelte'
	import DownloadFormsBtn, { handleSubmit } from '$lib/components/DownloadFormsBtn.svelte'

	import CatName from '$lib/components/CatName.svelte'
	import CatDob from '$lib/components/CatDOB.svelte'
	import CatGender from '$lib/components/CatGender.svelte'
	import AlteredWhenWhere from '$lib/components/AlteredWhenWhere.svelte'
	import CatFeralStatus from '$lib/components/CatFeralStatus.svelte'
	import IntakeNotes from '$lib/components/IntakeNotes.svelte'

	export let isPregnantNursing = false

	onMount(() => {
		if (isPregnantNursing) {
			$recvdFromPkg.surrenderType = surrenderChoicePregnant
			$catPkg.altered	= uynChoicesNo
			$catPkg.gender = genderChoiceFemale
		} else {
			$recvdFromPkg.surrenderType = surrenderChoiceSurrender
		}
	})

	async function submitForm() {
		handleSubmit('/api/v1/owner_surrender_form')
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

		<div>
			<BreedColorMarkings />
			<CatFeralStatus />
		</div>
		<SpecialNeeds />

		<VaccinesAndDiseaseTests />
		<Microchip />
		<VetInfo />
		<DietAndMedical />
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
		<template id="mom-paragraph"><slot name="mom-slot" /></template>
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
