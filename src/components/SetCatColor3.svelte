<script lang="ts">
	import { catInfo } from './stores.js';

	function changeCatInfo() {
		catInfo.set( 3);
	}
</script>

<button on:click={changeCatInfo}>
	Set Cat Info to 3
</button>