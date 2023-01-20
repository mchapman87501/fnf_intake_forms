<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores.js'
</script>

<label>
	FVRCP #1 <input type="date" bind:value={$catPkg.FVRCP1} />
</label>
<label>
	FVRCP #2 <input type="date" bind:value={$catPkg.FVRCP2} />
</label>
<label>
	FVRCP #3 <input type="date" bind:value={$catPkg.FVRCP3} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
