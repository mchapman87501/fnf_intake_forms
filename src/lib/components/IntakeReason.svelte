<script lang="ts">
	import { catPkg } from '../infrastructure/stores.js'
</script>

<span>Reason for surrender:</span><br />
<textarea bind:value={$catPkg.intakeReason} />

<style>
	span {
		font-size: 75%;
	}

	textarea {
		width: 90%;
	}
</style>
