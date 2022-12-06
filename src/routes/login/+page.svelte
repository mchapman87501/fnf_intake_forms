<script lang="ts">
	import { browser } from '$app/environment'
	import LoginForm from '$lib/components/LoginForm.svelte'
	// Support an optional query param explaining why we are here.
	let whyHere: string | null = null
	if (browser) {
		const urlParams = new URLSearchParams(window.location.search)
		whyHere = urlParams.get('reason')
	}
</script>

<LoginForm why={whyHere} />
