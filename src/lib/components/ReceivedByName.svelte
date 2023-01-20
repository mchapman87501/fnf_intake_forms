<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores.js'
</script>

<input type="text" placeholder={'(F&F representative)'} bind:value={$catPkg.intakeFnFRepr} />
