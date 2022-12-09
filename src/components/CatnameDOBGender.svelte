<script lang="ts">
	import { catPkg } from '../infrastructure/stores.js'
	import Dropdown from '../infrastructure/Dropdown.svelte'
	import { genderChoices } from '../infrastructure/Definitions.svelte'
	
</script>

<input class="name" type="text" placeholder="Cat's name" bind:value={$catPkg.catName} />
<label>
	DOB <input type="date" bind:value={$catPkg.DOB} />
</label>

<Dropdown choiceList={genderChoices} bind:value={$catPkg.gender} />

<style>
	label {
		font-size: 75%;
	}
</style>