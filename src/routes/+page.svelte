<script lang="ts">
	import { session_token, session_username } from '$lib/hooks/auth'
	import Dialog from '$lib/components/Dialog.svelte'
	import LoginForm from '$lib/components/LoginForm.svelte'

	import { initForms } from '../infrastructure/StoreFns.svelte'
	import IntakeForm from './IntakeForm.svelte'
	import OwnerSurrenderForm from './OwnerSurrenderForm.svelte'
	import PregnantNursingSurrenderForm from './PregnantNursingSurrenderForm.svelte'
	import RescueSurrenderForm from './RescueSurrenderForm.svelte'
	import StraySurrenderForm from './StraySurrenderForm.svelte'

	enum FormType {
		Unspecified = '-- Select --',
		Surrender = 'Surrender',
		Stray = 'Stray',
		Rescue = 'Rescue',
		PregnantNursing = 'Pregnant/Nursing',
		Intake = 'Intake'
	}

	let forms = [
		FormType.Unspecified,
		FormType.Surrender,
		FormType.Stray,
		FormType.Rescue,
		FormType.PregnantNursing,
		FormType.Intake
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

	<label class="right-margin"
		>Form:
		<select bind:value={pkg.selected_form}>
			{#each forms as formType}
				<option value={formType}>
					{formType}
				</option>
			{/each}
		</select>
	</label>
	<label>
		<button type="button" on:click={initForms}>&#9888; Reset all Forms to Defaults</button>
	</label>

	<hr />
	{#if pkg.selected_form == FormType.Surrender}
		<OwnerSurrenderForm />
	{:else if pkg.selected_form == FormType.Intake}
		<IntakeForm />
	{:else if pkg.selected_form == FormType.Stray}
		<StraySurrenderForm />
	{:else if pkg.selected_form == FormType.Rescue}
		<RescueSurrenderForm />
	{:else if pkg.selected_form == FormType.PregnantNursing}
		<PregnantNursingSurrenderForm />
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
	.right-margin {
		margin-right: 50%;
	}
</style>
