<script context="module" lang="ts">
	import Dialog from './Dialog.svelte'
	import LoginForm from './LoginForm.svelte'
	import { why } from './login_reason'

	let loginDialog: HTMLDialogElement

	const showLogin = (reason: string) => {
		why.set(reason)
		loginDialog.showModal()
	}

	function closeLoginDialog() {
		loginDialog.close()
		why.set('')
	}

	export { showLogin }
</script>

<Dialog bind:dialog={loginDialog} on:close={closeLoginDialog}>
	<LoginForm close={closeLoginDialog} />
</Dialog>
