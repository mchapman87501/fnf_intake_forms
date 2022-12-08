<script lang="ts">
	import { recvdFromPkg } from '../components/stores.js'
</script>

<input bind:value={$recvdFromPkg.fromName} placeholder={'Owner/Rescuer Name'} />
