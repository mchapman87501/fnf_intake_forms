<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
	import SpecialNeeds from './SpecialNeeds.svelte'
	import TreatableMedical from './TreatableMedical.svelte'
</script>

<div class="shots_and_tests">
	<label>
		<input type="checkbox" bind:checked={$catPkg.currentShots} />
		Current on Shots
	</label>
	<br />
	<label>
		<input type="checkbox" bind:checked={$catPkg.FELVFIVTested} />
		FELV/FIV Tested
	</label>

	{#if $catPkg.FELVFIVTested}
		<label>
			<input type="checkbox" bind:checked={$catPkg.FELVFIVPositive} />
			Positive
		</label>
		<label>
			Date tested
			<input type="date" bind:value={$catPkg.FELVFIVTestedDate} />
		</label>
	{/if}
</div>

<input type="text" placeholder="Previous Vet" bind:value={$catPkg.namePrevVet} />
<input type="tel" placeholder="Vet phone" bind:value={$catPkg.phonePrevVet} /><br />
<br />
<SpecialNeeds />

<br />
<TreatableMedical /><br />
<span>Current diet/medications:</span><br />
<textarea bind:value={$catPkg.dietMedications} /><br />

<style>
	div.shots_and_tests {
		margin: 0.5em 0;
	}
	label,
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
</style>
