<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores'
</script>

<label>
	Courtesy Listing (No Relinquishment)
	<input type="checkbox" bind:checked={$recvdFromPkg.courtesyListingNoRelinquishment} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
