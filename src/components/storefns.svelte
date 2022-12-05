<script lang="ts" context="module">
	import { catInfo, catInfoPkg } from './stores'
	import { get } from 'svelte/store'
	
	export function setOKKinder(val: string) {
		let temp = get(catInfoPkg)
		temp.okKinder = val
		catInfoPkg.set(temp)
	}
 
</script>
