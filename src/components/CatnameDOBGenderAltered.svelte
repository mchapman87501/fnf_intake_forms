<script lang="ts">
	import { catPkg } from './stores.js'
	import Dropdown from '../components/Dropdown.svelte'
	import { genderChoices, alteredChoices } from './Definitions.svelte'
</script>

<input class="name" type="text" placeholder="Cat's name" bind:value={$catPkg.catName} />
<input class="dob_age" type="text" placeholder="DOB/Age" bind:value={$catPkg.age} />

<Dropdown choiceList={genderChoices} bind:value={$catPkg.gender} />
<Dropdown choiceList={alteredChoices} bind:value={$catPkg.altered} />

<style>
	.name {
		width: 7em;
	}
	.dob_age {
		width: 5em;
	}
</style>
