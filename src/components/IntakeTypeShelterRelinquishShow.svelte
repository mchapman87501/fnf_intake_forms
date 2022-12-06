<script lang="ts">
	import { catPkg, recvdFromPkg } from './stores.js'
</script>

<input type="text" placeholder="SurrenderType" bind:value={$recvdFromPkg.surrenderType} />
<input type="text" placeholder="Shelter Number" bind:value={$recvdFromPkg.shelterNum} />
<input type="text" placeholder="Relinquish or Courtesy Listing" bind:value={$recvdFromPkg.relinquishCourtesyListing} />
TBD show or web only
