<script lang="ts" context="module">
	import { catInfo, catInfoPkg } from './stores'
	import { get } from 'svelte/store'
	
	export let uynChoices = ['Unknown', 'Yes', 'No']
    export let genderChoices = ['F/M Unknown', 'Female', 'Male']
	export let alteredChoices = ['Spay/Neuter Unknown', 'Spayed/Neutered', 'Intact']
	export let ownerNamePlaceholder = 'Owner/Guardian Name'
</script>