<script lang="ts">
	import { catPkg } from '../infrastructure/stores.js'
</script>

<span>Distinctive Features:</span><br />
<textarea bind:value={$catPkg.distinctiveFeatures} />

<style>
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
</style>