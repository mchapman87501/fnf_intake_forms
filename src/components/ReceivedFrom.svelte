<script lang="ts">
	import Dropdown from '../components/Dropdown.svelte'
	import Radiobuttons from '../components/Radiobuttons.svelte'
	import Checkbox from '../components/Checkbox.svelte'

	import { catPkg, recvdFromPkg } from '../components/stores.js'

	let ownerNamePlaceholder = 'Owner/Guardian Name2'
	let zipCodePattern = '\\d{5}'
</script>

<input bind:value={$recvdFromPkg.fromName} placeholder={ownerNamePlaceholder} />
<input type="date" bind:value={$catPkg.intakeDate} />

<br />

<input class="lic_no" bind:value={$recvdFromPkg.driversLic} placeholder="Driver's License #" /><br
/>

<input type="text" placeholder="Street Address" bind:value={$recvdFromPkg.address} />
<!-- TODO should Intake.svelte use Home, Cell or logic of two  -->
<input type="tel" placeholder="Home phone" bind:value={$recvdFromPkg.homePhone} /><br />

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
<input type="tel" placeholder="Work/Cell phone" bind:value={$recvdFromPkg.workCellPhone} /><br />
<input type="email" placeholder="Email Address" bind:value={$recvdFromPkg.email} />

<style>
	label {
		font-size: 75%;
	}
</style>
