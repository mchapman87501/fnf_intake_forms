<script lang="ts">
	import OwnerSurrenderForm from './OwnerSurrenderForm.svelte'

	enum FormType {
		Unspecified = '-- Select --',
		Owner = 'Owner',
		Stray = 'Stray',
		PregnantOrNursing = 'Pregnant/Nursing',
		Rescuer = 'Rescuer'
	}

	let forms = [
		FormType.Unspecified,
		FormType.Owner,
		FormType.Stray,
		FormType.PregnantOrNursing,
		FormType.Rescuer
	]
	let selected_form: FormType
</script>

<h3>Intake Forms</h3>

<select bind:value={selected_form}>
	{#each forms as formType}
		<option value={formType}>
			{formType}
		</option>
	{/each}
</select>

{#if selected_form == FormType.Owner}
	<OwnerSurrenderForm />
{:else if selected_form == null || selected_form == FormType.Unspecified}
	<p>Please select a form.</p>
{:else}
	<p>TBD</p>
{/if}

<style>
	:global(body) {
		background-image: linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)),
			url('/fnf_logo.png');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: 50% 0%;
	}
</style>
