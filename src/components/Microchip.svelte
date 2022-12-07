<script lang="ts">
	import { catPkg } from './stores.js'
	import { uynChoices, uynChoicesYes } from './Definitions.svelte';
	import Dropdown from './Dropdown.svelte';
</script>
<Dropdown title='Microchipped?' choiceList={uynChoices} bind:value={$catPkg.microchipped} />

{#if $catPkg.microchipped == uynChoicesYes}
	<input type="text" placeholder="Chip number" bind:value={$catPkg.microchipNum} />
{/if}

