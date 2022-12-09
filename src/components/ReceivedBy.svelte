<script lang="ts">
	import ReceivedByName from './ReceivedByName.svelte'
	import { catPkg } from './stores.js'
</script>

<p class="rep">
	Surrender accepted by
	<ReceivedByName />
</p>

<style>
	p.rep {
		font-style: italic;
		font-size: 80%;
	}
</style>
