<script lang="ts">
	import { catPkg } from './stores.js'
	import Dropdown from '../components/Dropdown.svelte'
	import { genderChoices, uynChoices, uynChoicesYes } from './Definitions.svelte'
</script>

<input class="name" type="text" placeholder="Cat's name" bind:value={$catPkg.catName} />
<label>
	DOB <input type="date" bind:value={$catPkg.DOB} />
</label>

<Dropdown choiceList={genderChoices} bind:value={$catPkg.gender} />
<Dropdown title="Spayed/Neutered" choiceList={uynChoices} bind:value={$catPkg.altered} />
{#if $catPkg.altered == uynChoicesYes}
	<label>
		Where done?
		<input type="text" bind:value={$catPkg.alteredFacility} />
	</label>
	<label>
		Date done? <input type="date" bind:value={$catPkg.alteredDate} />
	</label>
{/if}
<label>
	Declawed
<input type="checkbox" bind:checked={$catPkg.declawed} />
</label>

<style>
	.name {
		width: 7em;
	}
	label {
		font-size: 75%;
	}
</style>
