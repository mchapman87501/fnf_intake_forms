<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
	import Dropdown from '$lib/infrastructure/Dropdown.svelte'
	import { uynChoices } from '$lib/infrastructure/Definitions.svelte'
</script>

<Dropdown title="Bite History?" choiceList={uynChoices} bind:value={$catPkg.biteHistory} />
