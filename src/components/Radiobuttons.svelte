<script lang="ts">
	export let group: string
	export let title = ''
	export let choiceList: string[] = []
</script>
<label
	>{title}
	{#each choiceList as choice}
		<input type="radio" bind:group value={choice} />
			{choice}
	{/each}
</label>

<style>
	label,
	legend {
		font-size: 75%;
	}
</style>
