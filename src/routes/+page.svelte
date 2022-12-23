<script lang="ts">
	import { jwtSession, session_token, session_username } from '$lib/auth/auth'
	import Dialog from '$lib/components/Dialog.svelte'
	import LoginForm from '$lib/components/LoginForm.svelte'
	import { onMount } from 'svelte'
	import { initForms, cloneForm, initSession } from '../infrastructure/StoreFns.svelte'

	import IntakeForm from './IntakeForm.svelte'
	import OwnerSurrenderForm from './OwnerSurrenderForm.svelte'
	import WantsMomBack from '../components/WantsMomBack.svelte'
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
		loginDialog.showModal()
		// How to auto-focus the username field?
	}
	function closeLoginDialog() {
		loginDialog.close()
	}
	async function signOut() {
		let rqst = await fetch('/api/v1/logout', {
			method: 'POST',
			headers: { ...jwtSession() }
		})
		session_username.update((curr) => '')
		session_token.update((curr) => '')
	}

	//initialize defaults
	onMount(() => {
		initSession()
	})
</script>

{#if $session_token === undefined || $session_token == ''}
	<p class="user_info"><button on:click={signIn}>Sign In</button></p>
	<Dialog bind:dialog={loginDialog} on:close={closeLoginDialog}>
		<LoginForm loginReason="" close={closeLoginDialog} />
	</Dialog>
{:else}
	<p class="user_info">{$session_username} <button on:click={signOut}>Sign Out</button></p>

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
		<button type="button" on:click={cloneForm}>Clone received from fields, clear cat fields</button>
	</label>
	<label>
		<button type="button" on:click={initForms}>&#9888; Reset all Forms to Defaults</button>
	</label>

	<div>
		{#if pkg.selected_form == FormType.Surrender}
			<OwnerSurrenderForm />
		{:else if pkg.selected_form == FormType.Intake}
			<IntakeForm />
		{:else if pkg.selected_form == FormType.Stray}
			<StraySurrenderForm />
		{:else if pkg.selected_form == FormType.Rescue}
			<RescueSurrenderForm />
		{:else if pkg.selected_form == FormType.PregnantNursing}
			<OwnerSurrenderForm>
				<span slot="mom-slot"> <WantsMomBack /> </span>
			</OwnerSurrenderForm>
		{:else if pkg.selected_form == null || pkg.selected_form == FormType.Unspecified}
			<p>Please select a form.</p>
		{/if}
	</div>
{/if}

<style>
	.right-margin {
		margin-right: 5%;
	}

	.user_info {
		text-align: right;
	}

	div {
		margin-top: 1em;
		border: 1px solid #dddddd;
		border-radius: 5pt;
		padding: 1em;
		background-color: #f8f8f8;
	}
</style>
