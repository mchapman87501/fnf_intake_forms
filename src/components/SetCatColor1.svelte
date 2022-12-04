<script lang="ts">
	import { catInfo } from './stores.js';

	function changeCatInfo() {
		catInfo.set( 'red');
	}
</script>

<button on:click={changeCatInfo}>
	Set Cat Info to 1
</button>