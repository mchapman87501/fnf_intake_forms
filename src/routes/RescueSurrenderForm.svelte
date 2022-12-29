<script lang="ts">
	import { session_token, jwtSession, updateSessionToken } from '$lib/auth/auth'
	import { downloadIntakeForm, type DownloadInfo } from '$lib/download_info.js'
	import LoginDialog, { showLogin } from '$lib/components/LoginDialog.svelte'

	import ReceivedFromName from '../components/ReceivedFromName.svelte'
	import ReceivedFromDriversLic from '../components/ReceivedFromDriversLic.svelte'
	import ReceivedFromContactInfo from '../components/ReceivedFromContactInfo.svelte'
	import ReceivedBy from '../components/ReceivedBy.svelte'
	import BreedColorMarkings from '../components/BreedColorMarkings.svelte'
	import CatnameDOBGenderAltered from '../components/AlteredWhenWhere.svelte'
	import ShotsFIVTestedVetInfo from '../components/ShotsFIVTestedVetInfo.svelte'
	import OkWith from '../components/OkWith.svelte'
	import RescueLocation from '../components/RescueLocation.svelte'
	import Donation from '../components/Donation.svelte'
	import IntakeDate from '../components/IntakeDate.svelte'
	import PrevShelterInfo from '../components/PrevShelterInfo.svelte'
	import CourtesyListingNoRelinquishment from '../components/CourtesyListingNoRelinquishment.svelte'
	import TreatableMedical from '../components/TreatableMedical.svelte'
	import ShowNotWebOnly from '../components/ShowNotWebOnly.svelte'
	import SurrenderType from '../components/SurrenderType.svelte'

	import { catPkg, recvdFromPkg } from '../infrastructure/stores.js'

	async function handleSubmit() {
		const bearerToken = $session_token
		if (bearerToken == null) {
			showLogin('You must be logged in to submit a form.')
			return
		}

		const bodyData = {
			catInfo: $catPkg,
			receivedFrom: $recvdFromPkg
		}
		const bodyJSON = JSON.stringify(bodyData)
		// TODO move backend communications like this to src/lib.
		const response = await fetch('/api/v1/rescue_surrender_form', {
			method: 'POST',
			headers: { ...jwtSession(), 'Content-Type': 'application/json' },
			body: bodyJSON
		})

		if (response.status == 401) {
			// Unauthorized, or session has expired. -- need to redirect to login.
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

	<hr />

	<PrevShelterInfo />

	<hr />

	<CatnameDOBGenderAltered /><br />
	<BreedColorMarkings /><br />
	<ShotsFIVTestedVetInfo /><br />
	<OkWith /><br />
	<RescueLocation />
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
			title="Save this rescue surrender form and download the resulting intake form."
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
