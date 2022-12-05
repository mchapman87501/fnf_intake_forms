<script lang="ts">
	export let myOK :string = 'Unknown'
	export let myColor :string = 'Unknown'
	import { catInfo } from './stores.js'
	import { catInfoPkg } from './stores.js'
	import { setOKKinder } from './storefns.svelte'

	function changeCatInfo(value: string) {
		catInfo.set(value)
	}
</script>

<button on:click={() => changeCatInfo(myColor)}>
	Set Cat Info to {myColor}
</button>
<button on:click={() => setOKKinder(myOK)}>
	Set Cat Kinder to {myOK}
</button>
