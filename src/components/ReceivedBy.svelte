<script lang="ts">
	import { catPkg } from './stores.js'
</script>

<p class="rep">
	Surrender accepted by
	<input type="text" placeholder={'(F&F representative)'} bind:value={$catPkg.intakeFnFRepr} />
</p>

<style>
	p.rep {
		font-style: italic;
		font-size: 80%;
	}
</style>
