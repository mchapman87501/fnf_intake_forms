<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<span>Known History:</span><br />
<textarea bind:value={$catPkg.knownHistory} /><br />

<style>
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
</style>
