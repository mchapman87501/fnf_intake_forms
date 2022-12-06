<script lang="ts">
	import { catPkg } from './stores.js'
</script>

<div class="shots_and_tests">
	<label>
		<input type="checkbox" bind:checked={$catPkg.currentShots} />
		Current on Shots
	</label>
	<label>
		<input type="checkbox" bind:checked={$catPkg.FELVFIVTested} />
		FEL/FIV Tested
	</label>

	{#if $catPkg.FELVFIVTested}
		<label>
			<input type="checkbox" bind:checked={$catPkg.FELVFIVPositive} /> Positive
		</label>
		<label>
			<input
				type="text"
				placeholder="Date Tested for FELV/FIV"
				bind:value={$catPkg.FELVFIVTestedDate}
			/>
		</label>
	{/if}
</div>

<input type="text" placeholder="Name of Previous Vet" bind:value={$catPkg.namePrevVet} />
<input type="tel" placeholder="Vet phone" bind:value={$catPkg.phonePrevVet} /><br />

<span>Special needs/habits:</span><br />
<textarea bind:value={$catPkg.specialNeeds} /><br />

<span>Current diet/medications:</span><br />
<textarea bind:value={$catPkg.dietMedications}/><br />

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
