<script lang="ts">
  export let value
  export let title
</script>

<label>{title}
<select bind:value>
<option value="Unknown">Unknown</option>
<option value="Yes">Yes</option>
<option value="No">No</option>
</select>
</label>
	