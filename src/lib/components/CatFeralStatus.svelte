<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
	import Dropdown from '$lib/infrastructure/Dropdown.svelte'
	import { feralChoices } from '$lib/infrastructure/Definitions.svelte'
</script>

<Dropdown choiceList={feralChoices} bind:value={$catPkg.tameFeral} />
