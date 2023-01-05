<script context="module" lang="ts">
	import Dialog from '$lib/components/Dialog.svelte'
	import LoginForm from '$lib/components/LoginForm.svelte'

	let loginDialog: HTMLDialogElement
	let loginReason = ''

	const showLogin = (reason: string) => {
		loginReason = reason
		loginDialog.showModal()
	}

	function closeLoginDialog() {
		loginDialog.close()
	}

	export { showLogin }
</script>

<Dialog bind:dialog={loginDialog} on:close={closeLoginDialog}>
	<LoginForm bind:loginReason close={closeLoginDialog} />
</Dialog>
