<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<div>
	<span>Personality, habits, special needs:</span><br />
	<textarea bind:value={$catPkg.specialNeedsHabitsPersonality} />
</div>

<style>
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
	div {
		margin-top: 0.5em;
	}
</style>
