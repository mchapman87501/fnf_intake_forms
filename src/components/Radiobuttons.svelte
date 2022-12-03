<script lang="ts">
	export let group: string
	export let title: string
</script>

<legend>{title}</legend>
<label>
	<input type="radio" bind:group value={'Unknown'} />Unknown
</label>
<label>
	<input type="radio" bind:group value={'Yes'} />Yes
</label>
<label>
	<input type="radio" bind:group value={'No'} />No
</label>

<style>
	label,
	legend {
		font-size: 75%;
	}
</style>
