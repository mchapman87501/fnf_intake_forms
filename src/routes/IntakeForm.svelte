<script lang="ts">
	import { catInfoPkg } from '../components/stores.js'
	import Dropdown from '../components/Dropdown.svelte'
	import Radiobuttons from '../components/Radiobuttons.svelte'
	import { uynChoices, genderChoices, alteredChoices } from '../components/definitions.svelte'
	import {initializeCatInfoPkg} from '../components/storefns.svelte'

	function handleSubmit() {
		return false // prevent reload
	}

	let formValid = false
	function getFormValid() {
		return true
	}
	$: formValid = getFormValid()
</script>

<form on:submit|preventDefault={handleSubmit}>
	<div class="fieldset-auto-width">
		<label
			>Received:
			<!-- TODO: initialize/synchronize intake date  -->
			<input
				class="name"
				type="date"
				placeholder="Intake date"
				bind:value={$catInfoPkg.intakeDate}
			/>
		</label>
		<label
			>By:
			<input class="name" type="text" placeholder="Name" bind:value={$catInfoPkg.intakeFnFRepr} />
		</label>
	</div>
	<div>
		<label
			>From:
			<input class="name" type="text" placeholder="Name" bind:value={$catInfoPkg.recdFromName} />
			<input class="name" type="text" placeholder="Email" bind:value={$catInfoPkg.recdFromEmail} />
			<input class="name" type="text" placeholder="Phone" bind:value={$catInfoPkg.recdFromPhone} />
			<input
				class="name"
				type="text"
				placeholder="Intake reason"
				bind:value={$catInfoPkg.intakeReason}
			/>
		</label>
	</div>
	<br />
	<label
		>Cat's name:
		<input class="name" type="text" placeholder="Cat's name" bind:value={$catInfoPkg.catName} />
		<Dropdown choiceList={genderChoices} bind:value={$catInfoPkg.gender} />
		<Dropdown choiceList={alteredChoices} bind:value={$catInfoPkg.altered} />
		<input type="text" placeholder="Breed" bind:value={$catInfoPkg.breed} />
		<input type="text" placeholder="Color" bind:value={$catInfoPkg.color} />
	</label>
	<!-- TODO must coordinate with Microchipped flag in OwnerSurrenderForm.svelte -->
	<!-- <input type="text" placeholder="Chip number" bind:value={$catInfoPkg.microchipNum} /> -->

	<!-- TODO must coordinate with FELFIVTested toggle in OwnerSurrenderForm.svelte -->
	<!-- <label>
		<input type="checkbox" bind:value={$catInfoPkg.FELVFIVPositive} /> FELV/FIV Positive
	</label> -->

	<div>
		<fieldset class="fieldset-auto-width">
			<Radiobuttons title={'OK with cats?'} bind:group={$catInfoPkg.okCats} />
		</fieldset>
		<span>OK with</span>
		<label><input type="checkbox" bind:checked={$catInfoPkg.okDogs} /> dogs</label>
		<fieldset class="fieldset-auto-width">
			<Dropdown title={'OK with kids?'} choiceList={uynChoices} bind:value={$catInfoPkg.okKinder} />
		</fieldset>
	</div>
	<span>Special needs/habits:</span><br />
	<textarea bind:value={$catInfoPkg.specialNeeds}/><br />

	<div class="btns">
		<!-- TODO reset all fields, not just those in catInfoPkg -->
			<button type="button" on:click={initializeCatInfoPkg}>Clear form</button>
	</div>
	
</form>

<style>
	.btns {
		text-align: center;
	}
	label {
		font-size: 75%;
	}
	.fieldset-auto-width {
		display: inline-block;
	}
</style>
