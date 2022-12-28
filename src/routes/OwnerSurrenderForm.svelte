<script lang="ts">
	import { session_token, jwtSession, updateSessionToken } from '$lib/auth/auth'
	import type { DownloadInfo } from '$lib/download_info.js'
	import LoginDialog, { showLogin } from '$lib/components/LoginDialog.svelte'

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

	async function downloadIntakeForm(downloadInfo: DownloadInfo) {
		// Automatically download the generated intake form.
		// https://stackoverflow.com/a/42274086/2826337
		const options = {
			headers: { ...jwtSession() }
		}
		const downloadResp = await fetch(downloadInfo.srcURL, options)
		if (downloadResp.status == 200) {
			// Need to do this in order to save to downloadInfo.filename, instead
			// of saving to a randomly generated UUID.
			const anchor = document.createElement('a')
			anchor.href = window.URL.createObjectURL(await downloadResp.blob())
			anchor.download = downloadInfo.filename
			anchor.click()
		} else {
			console.error('Failed to download %o: %o', downloadInfo.srcURL, downloadResp.statusText)
		}
	}

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
			updateSessionToken(response)

			const body = await response.json()
			await downloadIntakeForm(body as DownloadInfo)
		}
	}

	let formValid = false
	function getFormValid() {
		return true
	}
	$: formValid = getFormValid()
</script>

<LoginDialog />

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
		<button
			type="submit"
			disabled={!formValid}
			title="Save this surrender form and download the resulting intake form."
		>
			Download Intake Form
		</button>
	</div>
</form>

<style>
	:global(input) {
		margin: 0.25em 0;
	}
</style>
