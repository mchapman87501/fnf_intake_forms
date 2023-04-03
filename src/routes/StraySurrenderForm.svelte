<script lang="ts">
	import { onMount } from 'svelte'
	import LoginDialog from '$lib/components/LoginDialog.svelte'

	import { catPkg, recvdFromPkg } from '$lib/infrastructure/stores'

	import ReceivedFromDriversLic from '$lib/components/ReceivedFromDriversLic.svelte'
	import ReceivedFromName from '$lib/components/ReceivedFromName.svelte'
	import ReceivedFromContactInfo from '$lib/components/ReceivedFromContactInfo.svelte'
	import CatDob from '$lib/components/CatDOB.svelte'
	import CatGender from '$lib/components/CatGender.svelte'
	import BreedColorMarkings from '$lib/components/BreedColorMarkings.svelte'
	import IntakeDate from '$lib/components/IntakeDate.svelte'
	import RescueLocation from '$lib/components/RescueLocation.svelte'
	import Donation from '$lib/components/Donation.svelte'
	import { surrenderChoiceStray } from '$lib/infrastructure/Definitions.svelte'
	import BiteHistory from '$lib/components/BiteHistory.svelte'
	import VaccinesAndDiseaseTests from '$lib/components/VaccinesAndDiseaseTests.svelte'
	import DownloadFormsBtn, { handleSubmit } from '$lib/components/DownloadFormsBtn.svelte'
	import AlteredWhenWhere from '$lib/components/AlteredWhenWhere.svelte'
	import CatFeralStatus from '$lib/components/CatFeralStatus.svelte'
	import IntakeNotes from '$lib/components/IntakeNotes.svelte'
	import SpecialNeeds from '$lib/components/SpecialNeeds.svelte'

	onMount(() => {
		$recvdFromPkg.surrenderType = surrenderChoiceStray
	})

	async function submitForm() {
		handleSubmit('/api/v1/stray_surrender_form')
	}
</script>

<LoginDialog />

<form on:submit|preventDefault={submitForm}>
	<fieldset>
		<legend>Contact</legend>
		<IntakeDate /><br />
		<ReceivedFromName />
		<ReceivedFromDriversLic /><br />
		<ReceivedFromContactInfo />
	</fieldset>

	<fieldset>
		<legend>Physical</legend>

		<div>
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
	</fieldset>

	<fieldset>
		<legend>Stray</legend>
		<RescueLocation />
		<div>
			<span>Illness or injuries observed</span><br />
			<textarea bind:value={$catPkg.illnessInjuryObs} />
		</div>
	</fieldset>

	<fieldset>
		<legend>Social</legend>
		<div>
			<BiteHistory />
		</div>
	
		<div>
			<span>Notes</span><br />
			<textarea bind:value={$catPkg.strayNotes} />
		</div>
	</fieldset>

	<fieldset>
		<legend>Intake</legend>

		<IntakeNotes />
		<Donation />
	</fieldset>

	<DownloadFormsBtn />
</form>

<style>
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
