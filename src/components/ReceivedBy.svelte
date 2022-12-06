<script lang="ts">
	import Dropdown from './Dropdown.svelte'
	import Radiobuttons from './Radiobuttons.svelte'
	import Checkbox from './Checkbox.svelte'

	import { catPkg, recvdFromPkg } from './stores.js'

	let currUser = '(F&F representative)'
	let donationPattern = '\\d+(\\.\\d{2})?'
</script>

<p class="rep">
	<input
		class="currency"
		type="text"
		placeholder="Donation"
		bind:value={$recvdFromPkg.donationAmount}
		pattern={donationPattern}
	/>
	<input type="text" placeholder="Form of Payment" bind:value={$recvdFromPkg.donationForm} />
	Surrender accepted by
	<input type="text" placeholder={currUser} bind:value={$catPkg.intakeFnFRepr} />
</p>

<style>
	p.rep {
		font-style: italic;
		font-size: 80%;
	}
	.currency {
		width: 4.5em;
		text-align: right;
	}
</style>
