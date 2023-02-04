<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<label>
	<input type="checkbox" bind:checked={$catPkg.treatableMedical} />
	Treatable Medical
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
