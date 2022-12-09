<script lang="ts">
	import { recvdFromPkg } from '../infrastructure/stores.js'

	let zipCodePattern = '\\d{5}'
</script>

<input class="lic_no" bind:value={$recvdFromPkg.driversLic} placeholder="Driver's License #" />



<style>
	.lic_no {
		width: 9em;
	}
</style>
