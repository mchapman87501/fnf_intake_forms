<script lang="ts">
	import SetCatColor1 from '../components/SetCatColor1.svelte'
	import SetCatColor2 from '../components/SetCatColor2.svelte'
	import SetCatColor3 from '../components/SetCatColor3.svelte'
	import { catInfo } from '../components/stores.js'
	import { catInfoPkg } from '../components/stores.js'



	function handleSubmit() {
		return false // prevent reload
	}

	let formValid = false
	function getFormValid() {
		console.log('valid tested')
		return true
	}
	$: formValid = getFormValid()
</script>

<form on:submit|preventDefault={handleSubmit}>
	Stored Cat Info is {$catInfo}
	<SetCatColor1 />
	<SetCatColor2 />
	<SetCatColor3 />
	Cat OK Kids {$catInfoPkg.okKinder}
	
</form>

<style>
</style>
