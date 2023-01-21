<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<span>Mother/Littermates:</span><br />
<textarea bind:value={$catPkg.motherLittermates} /><br />

<style>
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
</style>
