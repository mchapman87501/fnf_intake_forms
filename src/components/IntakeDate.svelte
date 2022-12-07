<script lang="ts">

	import { catPkg } from './stores.js'

</script>
<label>
Intake Date <input type="date" bind:value={$catPkg.intakeDate} />
</label>
<style>
	label {
		font-size: 75%;
	}
</style>