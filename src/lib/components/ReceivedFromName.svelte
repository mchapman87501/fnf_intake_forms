<script lang="ts">
	import { recvdFromPkg } from '../infrastructure/stores.js'
</script>

<input
	name="received_from_name"
	bind:value={$recvdFromPkg.fromName}
	placeholder={'Owner/Rescuer Name'}
/>
