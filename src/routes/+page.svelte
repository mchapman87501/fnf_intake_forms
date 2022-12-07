<script lang="ts">
	import { session_token, session_username } from '$lib/hooks/auth'
	import Dialog from '$lib/components/Dialog.svelte'
	import LoginForm from '$lib/components/LoginForm.svelte'
	import OwnerSurrenderForm from './OwnerSurrenderForm.svelte'

	enum FormType {
		Unspecified = '-- Select --',
		Owner = 'Owner',
		Stray = 'Stray',
		PregnantOrNursing = 'Pregnant/Nursing',
		Rescuer = 'Rescuer'
	}

	let forms = [
		FormType.Unspecified,
		FormType.Owner,
		FormType.Stray,
		FormType.PregnantOrNursing,
		FormType.Rescuer
	]

	let pkg = {
		selected_form: FormType.Unspecified
	}

	let loginDialog: HTMLDialogElement
	function signIn() {
		console.log('Showing sign-in dialog %o.', loginDialog)
		loginDialog.showModal()
	}
	function closeLoginDialog() {
		loginDialog.close()
	}
</script>

{#if $session_token === undefined || $session_token == ''}
	<p>Welcome! <button on:click={signIn}>Sign In</button></p>
	<Dialog bind:dialog={loginDialog} on:close={closeLoginDialog}>
		<LoginForm loginReason="" close={closeLoginDialog} />
	</Dialog>
{:else}
	<p>Welcome, {$session_username}.</p>

	<label>
		Form:
		<select bind:value={pkg.selected_form}>
			{#each forms as formType}
				<option value={formType}>
					{formType}
				</option>
			{/each}
		</select>
	</label>

	<hr />
	{#if pkg.selected_form == FormType.Owner}
		<OwnerSurrenderForm {...pkg} {FormType} />
	{:else if pkg.selected_form == null || pkg.selected_form == FormType.Unspecified}
		<p>Please select a form.</p>
	{:else}
		<p>TBD</p>
	{/if}
{/if}

<style>
	:global(body) {
		background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
			url('/fnf_logo.png');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: 50% 0%;
	}
</style>
