<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
	import Dropdown from '$lib/infrastructure/Dropdown.svelte'
	import { genderChoices } from '$lib/infrastructure/Definitions.svelte'
</script>

<input
	class="name"
	type="text"
	name="cat_name"
	placeholder="Cat's name"
	bind:value={$catPkg.catName}
/>
<label>
	DOB <input type="date" name="cat_age" bind:value={$catPkg.DOB} />
</label>

<Dropdown choiceList={genderChoices} name="cat_gender" bind:value={$catPkg.gender} />

<style>
	label {
		font-size: 75%;
	}
</style>
