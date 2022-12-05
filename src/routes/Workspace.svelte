<script lang="ts">
	import SetCatColor from '../components/SetCatColor.svelte'
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
	<SetCatColor myOK={"Unknown"} myColor={"Siamese"}/>
	<SetCatColor myOK={"Yes"} myColor={"Tabby"}/>
	<SetCatColor myOK={"No"} myColor={"MCX"}/>
	Cat OK Kids {$catInfoPkg.okKinder}
	
</form>

<style>
</style>
