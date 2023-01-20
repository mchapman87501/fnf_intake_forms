<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores.js'
</script>

<input type="text" placeholder="Shelter Number" bind:value={$recvdFromPkg.shelterNum} />
