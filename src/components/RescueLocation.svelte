<script lang="ts">
	import {recvdFromPkg } from '../infrastructure/stores.js'
</script>

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
