<script lang="ts">
	import { catPkg } from '../infrastructure/stores.js'
</script>

<label>
	Estimated size at maturity: <input type="text" bind:value={$catPkg.estMatureSize} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>