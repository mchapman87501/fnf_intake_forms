<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
	import Dropdown from '$lib/infrastructure/Dropdown.svelte'
	import { uynChoices, uynChoicesYes } from '$lib/infrastructure/Definitions.svelte'
</script>

<div class="vaccines_and_tests">
	<div class="row">
		<Dropdown
			title="Received Rabies vax?"
			choiceList={uynChoices}
			bind:value={$catPkg.receivedRabiesVax}
		/>
		{#if $catPkg.receivedRabiesVax == uynChoicesYes}
			<label>
				Expiration date (if known):
				<input type="date" bind:value={$catPkg.rabiesExpirationDate} />
			</label>
		{/if}
	</div>

	<div class="row">
		<Dropdown
			title="Received FVRCP vax?"
			choiceList={uynChoices}
			bind:value={$catPkg.receivedFVRCPVax}
		/>
		{#if $catPkg.receivedFVRCPVax == uynChoicesYes}
			<label
				>Expiration date (if known):
				<input type="date" bind:value={$catPkg.fvrcpExpirationDate} />
			</label>
		{/if}
	</div>

	<div class="row">
		<Dropdown title="FELV/FIV Tested?" choiceList={uynChoices} bind:value={$catPkg.FELVFIVTested} />
		{#if $catPkg.FELVFIVTested == uynChoicesYes}
			<label>
				<input type="checkbox" bind:checked={$catPkg.FELVFIVPositive} />
				Positive
			</label>
			<label>
				Date tested (if known):
				<input type="date" bind:value={$catPkg.FELVFIVTestedDate} />
			</label>
		{/if}
	</div>
</div>

<style>
	div.vaccines_and_tests {
		margin: 0.5em 0;
	}
	div.row {
		min-height: 2em;
		display: flex;
		align-items: center;
	}
	div.row label {
		margin-left: 1em;
	}
</style>
