<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<div>
	<input type="text" placeholder="Previous Vet" bind:value={$catPkg.namePrevVet} />
	<input type="tel" placeholder="Vet phone" bind:value={$catPkg.phonePrevVet} />
</div>
