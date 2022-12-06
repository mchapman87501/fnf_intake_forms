<script lang="ts">
	import { catPkg, recvdFromPkg } from './stores.js'
</script>

<input
	class="rescueDate"
	type="text"
	placeholder="Date cat was found"
	bind:value={$recvdFromPkg.dateOfRescue}
/>
<br />
<span>Location where cat was found:</span><br />
<textarea bind:value={$recvdFromPkg.locationOfRescue} /><br />

<style>
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
</style>
