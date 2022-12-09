<script lang="ts">
	import { catPkg } from '../infrastructure/stores.js'
	import { uynChoices, uynChoicesYes } from '../infrastructure/Definitions.svelte'
	import Dropdown from '../infrastructure/Dropdown.svelte'

</script>
<Dropdown title='Microchipped?' choiceList={uynChoices} bind:value={$catPkg.microchipped} />

{#if $catPkg.microchipped == uynChoicesYes}
	<input type="text" placeholder="Chip number" bind:value={$catPkg.microchipNum} />
{/if}

