<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<span>Other Comments [internal use only]:</span><br />
<textarea bind:value={$catPkg.otherCommentsInternalUseOnly} /><br />

<style>
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
</style>
