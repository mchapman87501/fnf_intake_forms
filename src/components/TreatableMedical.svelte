<script lang="ts">
	import {catPkg } from '../infrastructure/stores.js'
</script>

<label>
	Treatable Medical
	<input type="checkbox" bind:checked={$catPkg.treatableMedical}/>
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
