<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<div>
	<span>Intake Notes</span><br />
	<textarea bind:value={$catPkg.intakeNotes} />
</div>

<style>
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
</style>
