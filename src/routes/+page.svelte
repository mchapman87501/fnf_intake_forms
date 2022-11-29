<script lang="ts">
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
	];
	let selected_form: FormType;
</script>

<h1>Intake Forms</h1>

<label for="form_select">Intake Form:</label>
<select id="form_select" bind:value={selected_form}>
	{#each forms as formType}
		<option value={formType}>
			{formType}
		</option>
	{/each}
</select>

{#if selected_form == FormType.Owner}
	<p>TODO: Show Owner Surrender Form</p>
{:else if selected_form == null || selected_form == FormType.Unspecified}
	<p>Pleez select</p>
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
