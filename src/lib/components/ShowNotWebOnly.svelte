<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<label>
	<input type="checkbox" bind:checked={$catPkg.oKToShow} />
	OK to show (Not Web only)
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
