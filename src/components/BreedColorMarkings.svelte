<script lang="ts">
	import { catPkg } from './stores.js'
</script>

<input type="text" placeholder="Breed" bind:value={$catPkg.breed} />
<input type="text" placeholder="Color" bind:value={$catPkg.color} />
<input type="text" placeholder="Markings" bind:value={$catPkg.markings} />

