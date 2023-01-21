<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<label>
	OK to show (Not Web only)
	<input type="checkbox" bind:checked={$catPkg.oKToShow} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
