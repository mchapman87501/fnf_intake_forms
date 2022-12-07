<script lang="ts">
	import { catPkg, recvdFromPkg } from './stores.js'
</script>
<label>
	Surrender Type: <input type="text" placeholder="SurrenderType" bind:value={$recvdFromPkg.surrenderType} />
</label>


<input type="text" placeholder="Shelter Number" bind:value={$recvdFromPkg.shelterNum} />
<input type="text" placeholder="Relinquish or Courtesy Listing" bind:value={$recvdFromPkg.relinquishCourtesyListing} />
TBD show or web only
<style>
	label {
		font-size: 75%;
	}
</style>