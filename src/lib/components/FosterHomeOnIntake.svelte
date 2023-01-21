<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<span>Foster Home upon intake:</span><br />
<textarea bind:value={$catPkg.fosterHomeOnIntake} /><br />

<style>
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
</style>
