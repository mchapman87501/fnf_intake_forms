<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores'
</script>

<label>
	<input type="checkbox" bind:checked={$recvdFromPkg.wantsMomBack} />
	Wants to re-adopt Mother Cat after kittens are weaned and she has been spayed
</label>

<style>
	label {
		margin-left: 0;
		font-size: 75%;
	}
</style>
