<script lang="ts">
	import { catPkg } from '$lib/infrastructure/stores'
	import Dropdown from '$lib/infrastructure/Dropdown.svelte'
	import { genderChoices } from '$lib/infrastructure/Definitions.svelte'
</script>

<Dropdown choiceList={genderChoices} name="cat_gender" bind:value={$catPkg.gender} />
