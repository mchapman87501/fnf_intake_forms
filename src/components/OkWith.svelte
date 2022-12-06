<script lang="ts">
	import { catPkg } from './stores.js'
	import Dropdown from './Dropdown.svelte'
	import { okKidsChoices, okCatsChoices } from './Definitions.svelte'
</script>

<Dropdown choiceList={okKidsChoices} bind:value={$catPkg.okKinder} />
<Dropdown choiceList={okCatsChoices} bind:value={$catPkg.okCats} />

<span>OK with</span>
<label><input type="checkbox" bind:checked={$catPkg.okDogs} /> dogs</label>

<style>
	label,
	span {
		font-size: 75%;
	}
</style>
