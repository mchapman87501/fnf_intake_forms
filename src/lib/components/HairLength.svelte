<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<label>
	Hair Length: <input type="text" bind:value={$catPkg.hairLength} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
