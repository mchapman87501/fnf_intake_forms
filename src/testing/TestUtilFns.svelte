<script lang="ts" context="module">
	//https://stackoverflow.com/questions/35948335/how-can-i-check-if-two-map-objects-are-equal
	export function compareMaps(map1: any, map2: any) {
		var testVal
		if (map1.size !== map2.size) {
			return false
		}
		for (var [key, val] of map1) {
			testVal = map2.get(key)
			// in cases of an undefined value, make sure the key
			// actually exists on the object so there are no false positives
			if (testVal !== val || (testVal === undefined && !map2.has(key))) {
				console.log('Map mismatch on key = %o', key)
				return false
			}
		}
		return true
	}
</script>