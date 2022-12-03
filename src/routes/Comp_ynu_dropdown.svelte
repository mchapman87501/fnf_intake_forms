<script lang="ts">
  export let value
  export let title = ''
  export let choiceList = []
</script>

<label
	>{title}
	<select bind:value >
		{#each choiceList as choice }
         <option value= {choice} >
           {choice}
			</option>
		{/each}
	</select>
</label>

	