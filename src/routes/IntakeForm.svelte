<script lang="ts">
	import { catPkg } from '../components/stores.js'
	import Dropdown from '../components/Dropdown.svelte'
	import Radiobuttons from '../components/Radiobuttons.svelte'
	import { uynChoices, genderChoices, alteredChoices } from '../components/Definitions.svelte'
	import { initializecatPkg } from '../components/StoreFns.svelte'

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
				bind:value={$catPkg.intakeDate}
			/>
		</label>
		<label
			>By:
			<input class="name" type="text" placeholder="Name" bind:value={$catPkg.intakeFnFRepr} />
		</label>
	</div>
	<div>
		<label
			>From:
			<input class="name" type="text" placeholder="Name" bind:value={$catPkg.recdFromName} />
			<input class="name" type="text" placeholder="Email" bind:value={$catPkg.recdFromEmail} />
			<input class="name" type="text" placeholder="Phone" bind:value={$catPkg.recdFromPhone} />
		</label>
		<label
			>Reason:
			<input
				class="name"
				type="text"
				placeholder="Intake reason"
				bind:value={$catPkg.intakeReason}
			/>
		</label>
	</div>
	<br />
	<label
		>Cat's name:
		<input class="name" type="text" placeholder="Cat's name" bind:value={$catPkg.catName} />
		<input type="text" placeholder="Age" bind:value={$catPkg.age} />
		<Dropdown choiceList={genderChoices} bind:value={$catPkg.gender} />
		<Dropdown choiceList={alteredChoices} bind:value={$catPkg.altered} />
		<input type="text" placeholder="Breed" bind:value={$catPkg.breed} />
		<input type="text" placeholder="Color" bind:value={$catPkg.color} />
	</label>
	<!-- TODO must coordinate with Microchipped flag in OwnerSurrenderForm.svelte -->
	<!-- <input type="text" placeholder="Chip number" bind:value={$catPkg.microchipNum} /> -->

	<!-- TODO must coordinate with FELFIVTested toggle in OwnerSurrenderForm.svelte -->
	<!-- <label>
		<input type="checkbox" bind:value={$catPkg.FELVFIVPositive} /> FELV/FIV Positive
	</label> -->

	<div>
		<fieldset class="fieldset-auto-width">
			<Radiobuttons title={'OK with cats?'} bind:group={$catPkg.okCats} />
		</fieldset>
		<span>OK with</span>
		<label><input type="checkbox" bind:checked={$catPkg.okDogs} /> dogs</label>
		<fieldset class="fieldset-auto-width">
			<Dropdown title={'OK with kids?'} choiceList={uynChoices} bind:value={$catPkg.okKinder} />
		</fieldset>
	</div>
	<span>Special needs/habits:</span><br />
	<textarea bind:value={$catPkg.specialNeeds} /><br />

	<div class="btns">
		<!-- TODO reset all fields, not just those in catPkg -->
		<button type="button" on:click={initializecatPkg}>Clear form</button>
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
