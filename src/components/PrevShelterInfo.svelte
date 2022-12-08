<script lang="ts">
	import { catPkg, recvdFromPkg } from './stores.js'
</script>

<input type="text" placeholder="Shelter Number" bind:value={$recvdFromPkg.shelterNum} />
<input type="text" placeholder="ID at previous shelter" bind:value={$recvdFromPkg.shelterPrevID} />
<label>
	Bite history
<input type="checkbox" bind:checked={$catPkg.biteHistory} />
</label>
<style>
	label {
		font-size: 75%;
	}
</style>