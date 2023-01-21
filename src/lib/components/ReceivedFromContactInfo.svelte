<script lang="ts">
	import { recvdFromPkg } from '$lib/infrastructure/stores'
	let zipCodePattern = '\\d{5}'
</script>

<input
	type="text"
	name="street_address"
	placeholder="Street Address"
	bind:value={$recvdFromPkg.address}
/>

<input type="text" name="city" placeholder="City" bind:value={$recvdFromPkg.city} />

<!-- TODO use a menu -->
<input type="text" class="state_abbrev" placeholder="State" bind:value={$recvdFromPkg.state} />
<input
	type="text"
	class="zipcode"
	name="zipcode"
	placeholder="Zip code"
	pattern={zipCodePattern}
	bind:value={$recvdFromPkg.zip}
/><br />

<label
	>Cell/Home phone
	<input type="tel" name="home_phone" placeholder="Phone" bind:value={$recvdFromPkg.phone} />
</label>

<input
	type="email"
	name="email_addr"
	placeholder="Email Address"
	bind:value={$recvdFromPkg.email}
/>

<style>
	.zipcode {
		width: 5em;
	}
	input[type='tel'] {
		width: 9em;
	}
	.state_abbrev {
		width: 5em;
	}
	label {
		font-size: 75%;
		width: 130px;
	}
</style>
