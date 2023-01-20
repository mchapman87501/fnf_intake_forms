<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores.js'
	import { uynChoices, uynChoicesYes } from '$lib/infrastructure/Definitions.svelte'
	import Dropdown from '$lib/infrastructure/Dropdown.svelte'
</script>

<Dropdown title="Microchipped?" choiceList={uynChoices} bind:value={$catPkg.microchipped} />

{#if $catPkg.microchipped == uynChoicesYes}
	<input type="text" placeholder="Chip number" bind:value={$catPkg.microchipNum} />
{/if}
