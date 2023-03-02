<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'

	let dobControl: HTMLInputElement
	export function validateCatDOB() {
		if (dobControl.validity.valueMissing) {
			dobControl.setCustomValidity("Please select the cat's date of birth.\nIt's okay to guess.")
		} else {
			dobControl.setCustomValidity('')
		}
	}
</script>

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
