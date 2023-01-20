<script lang="ts">
	export let name = 'dropdown'
	export let value: string
	export let title = ''
	export let choiceList: string[] = []
</script>

<label
	>{title}
	<select {name} bind:value>
		{#each choiceList as choice}
			<option value={choice}>
				{choice}
			</option>
		{/each}
	</select>
</label>

<style>
	label {
		font-size: 75%;
	}
</style>
