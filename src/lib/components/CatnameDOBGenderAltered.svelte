<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
	import Dropdown from '$lib/infrastructure/Dropdown.svelte'
	import { uynChoices, uynChoicesYes } from '$lib/infrastructure/Definitions.svelte'

	import AlteredWhenWhere from './AlteredWhenWhere.svelte'
	import CatnameDOBGender from './CatnameDOBGender.svelte'
</script>

<CatnameDOBGender />
<Dropdown title="Spayed/Neutered" choiceList={uynChoices} bind:value={$catPkg.altered} />
{#if $catPkg.altered == uynChoicesYes}
	<AlteredWhenWhere />
{/if}
