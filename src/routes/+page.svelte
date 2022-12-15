<script lang="ts">
	import { onMount } from 'svelte'
	import { initForms, initSession } from '../infrastructure/StoreFns.svelte'

	import IntakeForm from './IntakeForm.svelte'
	import OwnerSurrenderForm from './OwnerSurrenderForm.svelte'
	import WantsMomBack from '../components/WantsMomBack.svelte'
	import RescueSurrenderForm from './RescueSurrenderForm.svelte'
	import StraySurrenderForm from './StraySurrenderForm.svelte'

	enum FormType {
		Unspecified = '-- Select --',
		Surrender = 'Surrender',
		Stray = 'Stray',
		Rescue = 'Rescue',
		PregnantNursing = 'Pregnant/Nursing',
		Intake = 'Intake'
	}

	let forms = [
		FormType.Unspecified,
		FormType.Surrender,
		FormType.Stray,
		FormType.Rescue,
		FormType.PregnantNursing,
		FormType.Intake
	]

	let pkg = {
		selected_form: FormType.Unspecified
	}
	//initialize defaults
	onMount(() => {
		initSession()
	})
</script>

<label class="right-margin"
	>Form:
	<select bind:value={pkg.selected_form}>
		{#each forms as formType}
			<option value={formType}>
				{formType}
			</option>
		{/each}
	</select>
</label>
<label>
	<button type="button" on:click={initForms}>&#9888; Reset all Forms to Defaults</button>
</label>

<hr />
{#if pkg.selected_form == FormType.Surrender}
	<OwnerSurrenderForm />
{:else if pkg.selected_form == FormType.Intake}
	<IntakeForm />
{:else if pkg.selected_form == FormType.Stray}
	<StraySurrenderForm />
{:else if pkg.selected_form == FormType.Rescue}
	<RescueSurrenderForm />
{:else if pkg.selected_form == FormType.PregnantNursing}
	<OwnerSurrenderForm>
		<span slot="mom-slot"> <WantsMomBack /> </span>
	</OwnerSurrenderForm>
{:else if pkg.selected_form == null || pkg.selected_form == FormType.Unspecified}
	<p>Please select a form.</p>
{:else}
	<p>TBD</p>
{/if}

<style>
	:global(body) {
		background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
			url('/fnf_logo.png');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: 50% 0%;
	}
	.right-margin {
		margin-right: 50%;
	}
</style>
