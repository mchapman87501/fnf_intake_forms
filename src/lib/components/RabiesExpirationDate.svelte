<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<label>
	Rabies expiration date: <input type="date" bind:value={$catPkg.rabiesExpirationDate} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
