<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores'
	import ReceivedByName from './ReceivedByName.svelte'

	let donationPattern = '\\d+(\\.\\d{2})?'
</script>

<div>
	<span class="rep">
		<input
			class="currency"
			type="text"
			placeholder="Donation"
			bind:value={$recvdFromPkg.donationAmount}
			pattern={donationPattern}
		/>
		<input type="text" placeholder="Form of Payment" bind:value={$recvdFromPkg.donationForm} />
	</span>
	<span class="rep">
	<template id="accepted-by-paragraph"><slot name="accepted-by-slot" >
		Surrender accepted by
	</slot></template>
</span>
	<ReceivedByName />
</div>

<style>
	.rep {
		margin: 0.5em 0;
		font-style: italic;
		font-size: 80%;
	}
	.currency {
		width: 4.5em;
		text-align: right;
	}
</style>
