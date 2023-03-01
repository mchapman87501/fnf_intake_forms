<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
	import Dropdown from '$lib/infrastructure/Dropdown.svelte'
	import { genderChoices } from '$lib/infrastructure/Definitions.svelte'

	let dobControl: HTMLInputElement
	export function validateCatDOB() {
		if (dobControl.validity.valueMissing) {
			dobControl.setCustomValidity("Please select the cat's date of birth.\nIt's okay to guess.")
		} else {
			dobControl.setCustomValidity('')
		}
	}
</script>

<input type="text" placeholder="Cat's name" bind:value={$catPkg.catName} />
<label>
	DOB <input
		type="date"
		bind:this={dobControl}
		bind:value={$catPkg.DOB}
		required
		on:invalid={validateCatDOB}
		on:change={validateCatDOB}
		on:input={validateCatDOB}
		title="Cat's date of birth (required - estimate if necessary)"
	/>
</label>

<Dropdown choiceList={genderChoices} name="cat_gender" bind:value={$catPkg.gender} />

<style>
	label {
		font-size: 75%;
	}

	*:required::after {
		font-size: 125%;
		content: '*';
		vertical-align: top;
		color: red;
	}
</style>
