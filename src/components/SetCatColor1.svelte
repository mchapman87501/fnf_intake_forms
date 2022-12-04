<script lang="ts">
	import { catInfo } from './stores.js';
	import { catInfoPkg } from './stores.js';

	function changeCatInfo() {
		catInfo.set( 'red');
	}
	function changeCatKinder() {
		$catInfoPkg.okKinder = "No"
	}
</script>

<button on:click={changeCatInfo}>
	Set Cat Info to red
</button>
<button on:click={changeCatKinder}>
	Set Cat Kinder to False
</button>