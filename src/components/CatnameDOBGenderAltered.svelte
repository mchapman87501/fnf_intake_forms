<script lang="ts">
	import { catPkg } from './stores.js'
	import Dropdown from './Dropdown.svelte'
	import { uynChoices, uynChoicesYes } from './Definitions.svelte'
	import AlteredWhenWhere from './AlteredWhenWhere.svelte'
	import CatnameDOBGender from './CatnameDOBGender.svelte'
</script>

<CatnameDOBGender />
<Dropdown title="Spayed/Neutered" choiceList={uynChoices} bind:value={$catPkg.altered} />
{#if $catPkg.altered == uynChoicesYes}
	<AlteredWhenWhere />
{/if}
