<script lang="ts">
	import { catInfoPkg } from '../components/stores.js'
	import Dropdown from '../components/Dropdown.svelte'
	import Radiobuttons from '../components/Radiobuttons.svelte'
	import { uynChoices, genderChoices } from '../components/definitions.svelte'

	function handleSubmit() {
		return false // prevent reload
	}

	let formValid = false
	function getFormValid() {
		return true
	}
	$: formValid = getFormValid()
</script>

<form on:submit|preventDefault={handleSubmit}>
	<div class = "fieldset-auto-width">
	<label>Received from: 
		<!-- TODO: initialize/synchronize intake date  -->
		<input class="name" type="date" placeholder="Intake date" bind:value={$catInfoPkg.intakeDate} /> 
		<input class="name" type="text" placeholder="Name" bind:value={$catInfoPkg.recdFromName} />
		<input class="name" type="text" placeholder="Email" bind:value={$catInfoPkg.recdFromEmail} />
		<input class="name" type="text" placeholder="Phone" bind:value={$catInfoPkg.recdFromPhone} />
		<input class="name" type="text" placeholder="Intake reason" bind:value={$catInfoPkg.intakeReason} />
	
	</label>
	</div>
	<br>
	<label
		>Cat's name:
		<input class="name" type="text" placeholder="Cat's name" bind:value={$catInfoPkg.catName} />
		<Dropdown choiceList={genderChoices} bind:value={$catInfoPkg.gender} />
		<input type="text" placeholder="Breed" bind:value={$catInfoPkg.breed} />
		<input type="text" placeholder="Color" bind:value={$catInfoPkg.color} />
	</label>
	<div>
		<fieldset class="fieldset-auto-width">
			<Dropdown title={'OK with kids?'} choiceList={uynChoices} bind:value={$catInfoPkg.okKinder} />
		</fieldset>

		<fieldset class="fieldset-auto-width">
			<Radiobuttons title={'OK with cats?'} bind:group={$catInfoPkg.okCats} />
		</fieldset>
	</div>
</form>

<style>
	label {
		font-size: 75%;
	}
	.fieldset-auto-width {
		display: inline-block;
	}
</style>
