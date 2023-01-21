<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
</script>

<label>
	Intake Date <input name="intake_date" type="date" bind:value={$catPkg.intakeDate} />
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
