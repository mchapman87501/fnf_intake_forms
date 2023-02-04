<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores'
</script>

<label>
	<input type="checkbox" bind:checked={$recvdFromPkg.courtesyListingNoRelinquishment} />
	Courtesy Listing (No Relinquishment)
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
