<script lang="ts">
	import IntakeForm from './IntakeForm.svelte'
	import OwnerSurrenderForm from './OwnerSurrenderForm.svelte'
	import Workspace from './Workspace.svelte'

	enum FormType {
		Unspecified = '-- Select --',
		Surrender = 'Surrender',
		Intake = 'Intake',
		Workspace = 'Workspace'
	}

	let forms = [FormType.Unspecified, FormType.Surrender, FormType.Intake, FormType.Workspace]

	let pkg = {
		selected_form: FormType.Unspecified
	}
</script>

<label
	>Form:
	<select bind:value={pkg.selected_form}>
		{#each forms as formType}
			<option value={formType}>
				{formType}
			</option>
		{/each}
	</select>
</label>

<hr />
{#if pkg.selected_form == FormType.Surrender}
	<OwnerSurrenderForm {...pkg} {FormType} />
{:else if pkg.selected_form == FormType.Intake}
	<IntakeForm />
{:else if pkg.selected_form == FormType.Workspace}
	<Workspace />
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
</style>
