<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores.js'
</script>

<input type="text" placeholder="ID at previous shelter" bind:value={$recvdFromPkg.shelterPrevID} />
