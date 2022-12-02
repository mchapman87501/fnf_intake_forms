<script lang="ts">
  export let value
  export let title
  let other = 'hello'
</script>
<label>{title}
<select bind:value>
    <option value="Unknown">Unknown</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>
  	</label>
	