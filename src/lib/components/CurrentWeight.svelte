<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<label>
	Current Weight: <input type="text" bind:value={$catPkg.currentWeight} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
