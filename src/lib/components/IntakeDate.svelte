<script lang="ts">
	import { catPkg } from '../infrastructure/stores.js'
</script>

<label>
	Intake Date <input name="intake_date" type="date" bind:value={$catPkg.intakeDate} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
