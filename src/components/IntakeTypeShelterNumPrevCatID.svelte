<script lang="ts">
	import { recvdFromPkg } from './stores.js'
</script>
<label>
	Surrender Type: <input type="text" placeholder="SurrenderType" bind:value={$recvdFromPkg.surrenderType} />
</label>


<input type="text" placeholder="Shelter Number" bind:value={$recvdFromPkg.shelterNum} />
<input type="text" placeholder="ID at previous shelter" bind:value={$recvdFromPkg.shelterPrevID} />
<style>
	label {
		font-size: 75%;
	}
</style>