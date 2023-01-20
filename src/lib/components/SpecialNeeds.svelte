<script lang="ts">
	import { catPkg } from '../infrastructure/stores.js'
</script>

<span>Special needs/habits:</span><br />
<textarea bind:value={$catPkg.specialNeeds} /><br />

<style>
	span {
		font-size: 75%;
	}
	textarea {
		width: 90%;
	}
</style>
