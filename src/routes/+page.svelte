<script lang="ts">
	import { session_username } from '$lib/auth'
	import Dialog from '$lib/components/Dialog.svelte'
	import LoginForm from '$lib/components/LoginForm.svelte'
	import { onMount } from 'svelte'
	import { initForms, cloneForm, initSession } from '$lib/infrastructure/StoreFns.svelte'

	import OwnerSurrenderForm from './OwnerSurrenderForm.svelte'
	import WantsMomBack from '$lib/components/WantsMomBack.svelte'
	import RescueSurrenderForm from './RescueSurrenderForm.svelte'
	import StraySurrenderForm from './StraySurrenderForm.svelte'

	enum FormType {
		Unspecified = '-- Select --',
		Surrender = 'Surrender',
		Stray = 'Stray',
		Rescue = 'Rescue',
		PregnantNursing = 'Pregnant/Nursing'
	}

	let forms = [
		FormType.Unspecified,
		FormType.Surrender,
		FormType.Stray,
		FormType.Rescue,
		FormType.PregnantNursing
	]

	let pkg = {
		selected_form: FormType.Unspecified
	}

	let loginDialog: HTMLDialogElement
	function signIn() {
		if (loginDialog) {
			loginDialog.showModal()
		}
	}
	function closeLoginDialog() {
		loginDialog.close()
	}
	async function signOut() {
		await fetch('/api/v1/logout', {
			method: 'POST'
		})
		session_username.update(() => '')
	}

	let isSignedIn = false
	$: isSignedIn = !(($session_username || '') == '')

	//initialize defaults
	onMount(() => {
		initSession()
	})
</script>

<div class="banner">
	<span class="title">Felines & Friends Intake</span>
	{#if isSignedIn}
		<span class="spacer">&nbsp;</span>
		<span class="user_info">
			{$session_username} <button on:click={signOut}>Sign Out</button>
		</span>
	{:else}
		<span class="user_info">
			<button on:click={signIn}>Please Sign In</button>
		</span>
	{/if}
</div>

{#if !isSignedIn}
	<Dialog bind:dialog={loginDialog} on:close={closeLoginDialog}>
		<LoginForm close={closeLoginDialog} />
	</Dialog>
{:else}
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

	<div class="fnf_form">
		{#if pkg.selected_form == FormType.Surrender}
			<OwnerSurrenderForm />
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

	.banner {
		padding: 0.5em 0.25em 0.5em 0;
		margin-bottom: 1em;
		border-bottom: 1px solid #dddddd;

		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.banner .title {
		font-weight: bold;
		font-size: 120%;
	}

	.banner .spacer {
		flex: 2 0 auto;
	}

	.user_info {
		margin-left: 1em;
	}

	.fnf_form {
		margin-top: 1em;
		/* border: 1px solid #c8c8c8;
		border-radius: 5pt; */
	}

	:global(fieldset) {
		margin-top: 0.25em;
		border: 1px solid #dddddd;
		border-radius: 3pt;
		background-color: #f8f8f8;
		padding-bottom: 0.1em;
	}
	:global(legend) {
		display: none;
		/* font-style: italic;
		font-size: 90%; */
	}
</style>
