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
<Dropdown title="Spayed/Neutered" choiceList={uynChoices} bind:value={$catPkg.spayedneutered} />
{#if $catPkg.spayedneutered == uynChoicesYes}
	<label>
		Where done?
		<input type="text" bind:value={$catPkg.spayedneuteredFacility} />
	</label>
	<label>
		Date done? <input type="date" bind:value={$catPkg.spayedneuteredDate} />
	</label>
{/if}

<style>
	.name {
		width: 7em;
	}
	label {
		font-size: 75%;
	}
</style>
