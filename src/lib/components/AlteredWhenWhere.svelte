<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores.js'
	import CatnameDOBGender from '$lib/components/CatnameDOBGender.svelte'
</script>

<CatnameDOBGender />
<label>
	Date spayed/neutered? <input type="date" bind:value={$catPkg.alteredDate} />
</label>
<label>
	Where spayed/neutered?
	<input type="text" bind:value={$catPkg.alteredFacility} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
