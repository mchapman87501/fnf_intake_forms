<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<input type="text" placeholder={'(F&F representative)'} bind:value={$catPkg.intakeFnFRepr} />
