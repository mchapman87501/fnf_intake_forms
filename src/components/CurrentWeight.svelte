<script lang="ts">
	import { catPkg } from '../infrastructure/stores.js'
</script>

<label>
	Current Weight: <input type="text" bind:value={$catPkg.currentWeight} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>