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
	<label
		>Cat's name:
		<input class="name" type="text" placeholder="Cat's name" bind:value={$catInfoPkg.name} />
		<Dropdown choiceList={genderChoices} bind:value={$catInfoPkg.gender} />
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
	label,
	span {
		font-size: 75%;
	}
	.fieldset-auto-width {
		display: inline-block;
	}
</style>
