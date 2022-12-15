<script lang="ts">
	import { recvdFromPkg } from '../infrastructure/stores.js'
	import Dropdown from '../infrastructure/Dropdown.svelte'
	import { surrenderChoices } from '../infrastructure/Definitions.svelte'
</script>
<Dropdown title="Intake type" choiceList={surrenderChoices} bind:value={$recvdFromPkg.surrenderType} />

