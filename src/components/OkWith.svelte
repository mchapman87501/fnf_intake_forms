<script lang="ts">
	import { catPkg } from './stores.js'
	import Dropdown from './Dropdown.svelte'
	import { uynChoices } from './Definitions.svelte'
</script>

<Dropdown title='Ok with Kids?' choiceList={uynChoices} bind:value={$catPkg.okKinder} />
<Dropdown title='Ok with Cats?' choiceList={uynChoices} bind:value={$catPkg.okCats} />
<Dropdown title='Ok with Dogs?' choiceList={uynChoices} bind:value={$catPkg.okDogs} />