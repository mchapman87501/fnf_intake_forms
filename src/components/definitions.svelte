<script lang="ts" context="module">
	import { catInfo, catInfoPkg } from './stores'
	import { get } from 'svelte/store'
	
	export let uynChoices = ['Unknown', 'Yes', 'No']
    export let genderChoices = ['F/M Unknown', 'Female', 'Male']
</script>