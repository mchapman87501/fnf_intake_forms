<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores'
</script>

<input
	name="received_from_name"
	bind:value={$recvdFromPkg.fromName}
	placeholder={'Owner/Rescuer Name'}
/>
