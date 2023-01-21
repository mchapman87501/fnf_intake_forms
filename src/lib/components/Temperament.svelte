<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<span>Temperament:</span><br />
<textarea bind:value={$catPkg.temperament} /><br />

<style>
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
</style>
