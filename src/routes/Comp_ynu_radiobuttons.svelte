<script lang="ts">
  export let value
  export let title
</script>

<legend>{title}</legend>
<label>
  <input type=radio bind:group={value} name="value" value={"Unknown"}>Unknown
</label>
<label>
  <input type=radio bind:group={value} name="value"  value={"Yes"}>Yes
</label> 
<label>
  <input type=radio bind:group={value} name="value" value={"No"}>No
</label> 
	