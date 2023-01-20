<script lang="ts">
	export let value: boolean = false
	export let title = ''
</script>

<label>
	{title}
	<input type="checkbox" bind:checked={value} />
</label>
 
<style>
	label {
		font-size: 75%;
	}
</style>
