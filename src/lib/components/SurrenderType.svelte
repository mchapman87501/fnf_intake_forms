<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores'
	import Dropdown from '$lib/infrastructure/Dropdown.svelte'
	import { surrenderChoices } from '$lib/infrastructure/Definitions.svelte'
</script>

<Dropdown
	title="Intake type"
	choiceList={surrenderChoices}
	bind:value={$recvdFromPkg.surrenderType}
/>
