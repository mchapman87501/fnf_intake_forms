<script lang="ts">
	import IntakeForm from './IntakeForm.svelte'
	import OwnerSurrenderForm from './OwnerSurrenderForm.svelte'
	import { initForms } from '../components/StoreFns.svelte'

	enum FormType {
		Unspecified = '-- Select --',
		Surrender = 'Surrender',
		Intake = 'Intake'
	}

	let forms = [FormType.Unspecified, FormType.Surrender, FormType.Intake]

	let pkg = {
		selected_form: FormType.Unspecified
	}
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
