<script lang="ts">
	import { catPkg } from './stores.js'
	import Dropdown from './Dropdown.svelte'
	import { genderChoices } from './Definitions.svelte'
</script>

<input class="name" type="text" placeholder="Cat's name" bind:value={$catPkg.catName} />
<label>
	DOB <input type="date" bind:value={$catPkg.DOB} />
</label>

<Dropdown choiceList={genderChoices} bind:value={$catPkg.gender} />

