<script lang="ts">
	import { catPkg } from '../infrastructure/stores.js'
	import SpecialNeeds from './SpecialNeeds.svelte';
</script>

<div class="shots_and_tests">
	<label>
		Current on Shots
		<input type="checkbox" bind:checked={$catPkg.currentShots} />
	
	</label>
	<br/>
	<label>
		FELV/FIV Tested
		<input type="checkbox" bind:checked={$catPkg.FELVFIVTested} />
	</label>

	{#if $catPkg.FELVFIVTested}
		<label>Positive
			<input type="checkbox" bind:checked={$catPkg.FELVFIVPositive} /> 
		</label>
		<label>
			Date tested
			<input type="date" bind:value={$catPkg.FELVFIVTestedDate}/>
		</label>
	{/if}
</div>

<input type="text" placeholder= "Previous Vet" bind:value={$catPkg.namePrevVet} />
<input type="tel" placeholder="Vet phone" bind:value={$catPkg.phonePrevVet} /><br />

<SpecialNeeds/><br />

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
