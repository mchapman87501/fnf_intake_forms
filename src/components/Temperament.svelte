<script lang="ts">
	import {catPkg } from '../infrastructure/stores.js'
</script>

<span>Temperament:</span><br />
<textarea bind:value={$catPkg.temperament} /><br />

<style>
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
</style>
