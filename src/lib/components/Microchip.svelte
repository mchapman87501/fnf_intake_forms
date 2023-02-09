<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
	import { uynChoices, uynChoicesYes } from '$lib/infrastructure/Definitions.svelte'
	import Dropdown from '$lib/infrastructure/Dropdown.svelte'
</script>

<div>
	<Dropdown title="Microchipped?" choiceList={uynChoices} bind:value={$catPkg.microchipped} />

	{#if $catPkg.microchipped == uynChoicesYes}
		<input
			class="chip_num"
			type="text"
			placeholder="Chip number"
			bind:value={$catPkg.microchipNum}
		/>
	{/if}
</div>

<style>
	div {
		min-height: 1.8em;
		display: flex;
		align-items: center;
		margin: 0.5em 0;
	}

	.chip_num {
		margin-left: 1em;
	}
</style>
