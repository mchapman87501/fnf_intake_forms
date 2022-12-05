<script lang="ts">
	import { catInfoPkg } from '../components/stores.js'
	import Dropdown from '../components/Dropdown.svelte'
	import Radiobuttons from '../components/Radiobuttons.svelte'
	let uynChoices = ['Unknown', 'Yes', 'No']
	

	function handleSubmit() {
		return false // prevent reload
	}

	let formValid = false
	function getFormValid() {
		console.log('valid tested')
		return true
	}
	$: formValid = getFormValid()
</script>

<form on:submit|preventDefault={handleSubmit}>
	Cat OK Kids {$catInfoPkg.okKinder}
	Cat OK Cats {$catInfoPkg.okCats}
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
</style>
