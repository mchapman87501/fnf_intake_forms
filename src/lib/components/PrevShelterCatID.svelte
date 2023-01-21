<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores'
</script>

<input type="text" placeholder="ID at previous shelter" bind:value={$recvdFromPkg.shelterPrevID} />
