<script lang="ts">
	import { catInfo } from './stores.js';
	import { catInfoPkg } from './stores.js';

	function changeCatInfo() {
		catInfo.set('white');
	}
	function changeCatKinder() {
		$catInfoPkg.okKinder = "Yes"
	}
</script>

<button on:click={changeCatInfo}>
	Set Cat Info to white
</button>
<button on:click={changeCatKinder}>
	Set Cat Kinder to True
</button>