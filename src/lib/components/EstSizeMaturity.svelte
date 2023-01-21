<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<label>
	Estimated size at maturity: <input type="text" bind:value={$catPkg.estMatureSize} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
