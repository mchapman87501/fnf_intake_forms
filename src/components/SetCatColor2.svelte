<script lang="ts">
	import { catInfo } from './stores.js';

	function changeCatInfo() {
		catInfo.set('white');
	}
</script>

<button on:click={changeCatInfo}>
	Set Cat Info to 2
</button>