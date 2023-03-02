<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<input type="text" placeholder="Cat's name" bind:value={$catPkg.catName} />
