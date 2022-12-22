<script lang="ts">
    import {fade} from 'svelte/transition'

	import { session_token, jwtSession, updateSessionToken } from '$lib/auth/auth'
	import Dialog from '$lib/components/Dialog.svelte'
	import LoginForm from '$lib/components/LoginForm.svelte'

	import { catPkg, recvdFromPkg } from '../infrastructure/stores.js'
	
	import ReceivedFromDriversLic from '../components/ReceivedFromDriversLic.svelte'
	import ReceivedFromName from '../components/ReceivedFromName.svelte'
	import ReceivedFromContactInfo from '../components/ReceivedFromContactInfo.svelte'
	import ReceivedBy from '../components/ReceivedBy.svelte'
	import IntakeDate from '../components/IntakeDate.svelte'
	import CatnameDOBGenderAltered from '../components/CatnameDOBGenderAltered.svelte'
	import BreedColorMarkings from '../components/BreedColorMarkings.svelte'
	import Microchip from '../components/Microchip.svelte'
	import ShotsFivTestedVetInfo from '../components/ShotsFIVTestedVetInfo.svelte'
	import OkWith from '../components/OkWith.svelte'
	import IntakeReason from '../components/IntakeReason.svelte'
	import Donation from '../components/Donation.svelte'
	import CourtesyListingNoRelinquishment from '../components/CourtesyListingNoRelinquishment.svelte'
	import TreatableMedical from '../components/TreatableMedical.svelte'
	import ShowNotWebOnly from '../components/ShowNotWebOnly.svelte'
	import SurrenderType from '../components/SurrenderType.svelte'

	// Login form management.
	let loginDialog: HTMLDialogElement
	let loginReason = ''
	function showLogin(reason: string) {
		loginReason = reason
		loginDialog.showModal()
	}
	function closeLoginDialog() {
		loginDialog.close()
	}

	const backendBaseURL = '/api/v1'

	async function handleSubmit() {
		const bearerToken = $session_token
		if (bearerToken == null) {
			showLogin('You must be logged in to submit a form.')
			return
		}

		const bodyData = {
			cat_info: $catPkg,
			received_from: $recvdFromPkg
		}
		const bodyJSON = JSON.stringify(bodyData)
		// TODO move backend communications like this to src/lib.
		const response = await fetch('/api/v1/owner_surrender_form', {
			method: 'POST',
			headers: { ...jwtSession(), 'Content-Type': 'application/json' },
			body: bodyJSON
		})

		if (response.status == 401) {
			// Unauthorized, or session has expired. -- need to redirect to login.
			// TODO maintain form state in a store, so it can be restored
			// on return.
			showLogin('Your session has expired.')
		} else if (response.status == 200) {
			const body = await response.json()

            statusVisible = true
            setTimeout(() => {
                statusVisible = false
            }, 2000)

            updateSessionToken(response)
		}
	}

	let formValid = false
	function getFormValid() {
		return true
	}
	$: formValid = getFormValid()

    let statusVisible = false;
</script>

<Dialog bind:dialog={loginDialog} on:close={closeLoginDialog}>
	<LoginForm bind:loginReason close={closeLoginDialog} />
</Dialog>

<form on:submit|preventDefault={handleSubmit}>
	<IntakeDate />
	<SurrenderType /><br />
	<ReceivedFromName />
	<ReceivedFromDriversLic /> <br />
	<ReceivedFromContactInfo />
	<template id="mom-paragraph"><p><slot name="mom-slot" /></p></template>
	<hr />

	<CatnameDOBGenderAltered /><br />
	<BreedColorMarkings /><br />
	<Microchip /><br />
	<ShotsFivTestedVetInfo /><br />
	<OkWith /><br />
	<IntakeReason /><br />
	<CourtesyListingNoRelinquishment />
	<TreatableMedical />
	<ShowNotWebOnly />
	<hr />
	<Donation />
	<ReceivedBy />

	<hr />

	<div class="btns">
		<button type="submit" disabled={!formValid}>Save</button>
        {#if statusVisible}
        <span transition:fade class="status_msg">Saved</span>
        {/if}
	</div>
</form>

<style>
    .status_msg {
        font-size: 70%;
        color: #999999;
        margin: 0 1em;
    }

    :global(input) {
        margin: 0.25em 0;
    }
    :global(textarea) {
        border-color: #bbbbbb;
        border-radius: 2pt;
    }
</style>