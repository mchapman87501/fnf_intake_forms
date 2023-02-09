<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores'
</script>

<div>
	<span>Location where cat was found:</span><br />
	<textarea bind:value={$recvdFromPkg.locationOfRescue} /><br />
</div>

<style>
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
	div {
		margin: 0.5em 0;
	}
</style>
