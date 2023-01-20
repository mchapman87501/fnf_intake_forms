<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores.js'

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
