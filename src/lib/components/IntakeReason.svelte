<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<div>
	<span>Reason for surrender:</span><br />
	<textarea bind:value={$catPkg.intakeReason} />
</div>

<style>
	span {
		font-size: 75%;
	}

	textarea {
		width: 90%;
	}
</style>
