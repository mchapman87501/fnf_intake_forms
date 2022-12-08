<script lang="ts">
	import { recvdFromPkg } from '../components/stores.js'

	let zipCodePattern = '\\d{5}'
</script>

<input bind:value={$recvdFromPkg.fromName} placeholder={'Owner/Rescuer Name'} />
<input class="lic_no" bind:value={$recvdFromPkg.driversLic} placeholder="Driver's License #" /><br
/>

<input type="text" placeholder="Street Address" bind:value={$recvdFromPkg.address} />

<input type="text" placeholder="City" bind:value={$recvdFromPkg.city} />

<!-- TODO use a menu -->
<input type="text" class="state_abbrev" placeholder="State" bind:value={$recvdFromPkg.state} />
<input
	type="text"
	class="zipcode"
	placeholder="Zip code"
	pattern={zipCodePattern}
	bind:value={$recvdFromPkg.zip}
/>
<input type="tel" placeholder="Phone" bind:value={$recvdFromPkg.phone} />
<label
	>Text messages ok?
	<input type="checkbox" bind:checked={$recvdFromPkg.textOK} />
</label>
<br />
<input type="email" placeholder="Email Address" bind:value={$recvdFromPkg.email} />

<style>
	.zipcode {
		width: 5em;
	}
	.lic_no {
		width: 9em;
	}
	input[type='tel'] {
		width: 9em;
	}
	.state_abbrev {
		width: 5em;
	}
	label {
		font-size: 75%;
	}
</style>
