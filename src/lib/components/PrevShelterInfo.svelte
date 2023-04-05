<script lang="ts">
	import PrevShelterCatId from './PrevShelterCatID.svelte'
	import PrevShelterNum from './PrevShelterNum.svelte'
	import { shelterIDChoices } from '$lib/infrastructure/Definitions.svelte'
	import { recvdFromPkg } from '$lib/infrastructure/stores'
	import Dropdown from '$lib/infrastructure/Dropdown.svelte'
	
</script>
<Dropdown title="From" choiceList={shelterIDChoices} bind:value={$recvdFromPkg.locationOfRescue} />
<PrevShelterNum />
<PrevShelterCatId />
