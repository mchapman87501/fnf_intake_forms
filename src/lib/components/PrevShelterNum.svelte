<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores'
</script>

<input type="text" placeholder="Shelter Number" bind:value={$recvdFromPkg.shelterNum} />
