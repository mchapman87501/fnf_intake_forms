<script lang="ts">
	import { recvdFromPkg } from '../infrastructure/stores.js'
</script>

<input bind:value={$recvdFromPkg.fromName} placeholder={'Owner/Rescuer Name'} />
