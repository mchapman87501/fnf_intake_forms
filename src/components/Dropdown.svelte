<script lang="ts">
	export let value: string
	export let title = ''
	export let choiceList: string[] = []
</script>

<label
	>{title}
	<select bind:value>
		{#each choiceList as choice}
			<option value={choice}>
				{choice}
			</option>
		{/each}
	</select>
</label>

<style>
	label,
	legend {
		font-size: 75%;
	}
</style>
