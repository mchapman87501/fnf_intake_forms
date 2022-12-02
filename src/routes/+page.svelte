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

<label
	>Form:
	<select bind:value={selected_form}>
		{#each forms as formType}
			<option value={formType}>
				{formType}
			</option>
		{/each}
	</select>
</label>

<hr />
{#if selected_form == FormType.Owner}
	<OwnerSurrenderForm formType={selected_form}/>
{:else if selected_form == null || selected_form == FormType.Unspecified}
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
