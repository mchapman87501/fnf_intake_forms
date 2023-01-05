<script lang="ts">
	import { onMount } from 'svelte'

	// See https://dev.to/myleftshoe/svelte-dialogs-the-easy-way-e0f
	export let dialog: HTMLDialogElement
</script>

<dialog bind:this={dialog} on:close>
	<slot />
</dialog>

<style>
	dialog {
		border: 1px solid black;
		border-radius: 5pt;
		padding: 0.5em;
	}
</style>
