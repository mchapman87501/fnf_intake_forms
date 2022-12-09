<script lang="ts">
	import { catPkg } from './stores.js'
</script>

<label>
	Bite history
	<input type="checkbox" bind:checked={$catPkg.biteHistory} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
