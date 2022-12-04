<script lang="ts">
	import { catInfo } from './stores.js';

	function changeCatInfo() {
		catInfo.set( 'black');
	}
</script>

<button on:click={changeCatInfo}>
	Set Cat Info to black
</button>