<script lang="ts">
	import { catPkg } from './stores.js'
	import { microchippedChoices, microchippedChoiceChipped } from './Definitions.svelte';
	import Dropdown from './Dropdown.svelte';
</script>

<Dropdown choiceList={microchippedChoices} bind:value={$catPkg.microchipped} />

{#if $catPkg.microchipped == microchippedChoiceChipped}
	<input type="text" placeholder="Chip number" bind:value={$catPkg.microchipNum} />
{/if}

