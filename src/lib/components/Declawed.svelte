<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<label>
	Declawed
	<input type="checkbox" bind:checked={$catPkg.declawed} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
