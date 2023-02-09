<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores'
</script>

<input
	class="lic_no"
	name="drivers_license_no"
	bind:value={$recvdFromPkg.driversLic}
	placeholder="Driver's License #"
/>

<style>
	.lic_no {
		width: 9em;
	}
</style>
