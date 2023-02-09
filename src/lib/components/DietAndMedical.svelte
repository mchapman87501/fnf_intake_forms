<script lang="ts">
	import TreatableMedical from '$lib/components/TreatableMedical.svelte'
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<div>
	<TreatableMedical /><br />
	<span>Current diet/medications:</span><br />
	<textarea bind:value={$catPkg.dietMedications} /><br />
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
