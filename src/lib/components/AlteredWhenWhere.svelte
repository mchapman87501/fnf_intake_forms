<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
	import Dropdown from '$lib/infrastructure/Dropdown.svelte'
	import { uynChoices, uynChoicesYes } from '$lib/infrastructure/Definitions.svelte'
</script>

<div>
	<Dropdown title="Spayed/Neutered" choiceList={uynChoices} bind:value={$catPkg.altered} />
	{#if $catPkg.altered == uynChoicesYes}
		<label>
			Date spayed/neutered? <input type="date" bind:value={$catPkg.alteredDate} />
		</label>
		<label>
			Where spayed/neutered?
			<input type="text" bind:value={$catPkg.alteredFacility} />
		</label>
	{/if}
</div>

<style>
	label {
		font-size: 75%;
	}
</style>
