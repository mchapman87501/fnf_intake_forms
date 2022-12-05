<script lang="ts">
	import { catInfo } from './stores.js';
	import { catInfoPkg } from './stores.js';
	import { setOKKinder} from './storefns.svelte'

	function changeCatInfo() {
		catInfo.set( 'black');
	}
	
	let myOK = 'No'
</script>

<button on:click={changeCatInfo}>
	Set Cat Info to black
</button>
<button on:click={() => setOKKinder(myOK)}>
	Set Cat Kinder to {myOK}
</button>