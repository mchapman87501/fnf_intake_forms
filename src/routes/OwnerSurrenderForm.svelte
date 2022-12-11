<script lang="ts">
	import { onMount } from 'svelte'

	import { session_token, jwtSession } from '$lib/hooks/auth'
	import Dialog from '$lib/components/Dialog.svelte'
	import LoginForm from '$lib/components/LoginForm.svelte'

	import { catPkg, recvdFromPkg } from '../infrastructure/stores.js'
	import { getInfoAsCSV } from '../infrastructure/UtilFns.svelte'
	import { initSession, setSurrenderType } from '../infrastructure/StoreFns.svelte'
	import { surrenderChoiceSurrender } from '../infrastructure/Definitions.svelte'
	import ReceivedFromDriversLic from '../components/ReceivedFromDriversLic.svelte'
	import ReceivedFromName from '../components/ReceivedFromName.svelte'
	import ReceivedFromContactInfo from '../components/ReceivedFromContactInfo.svelte'
	import ReceivedBy from '../components/ReceivedBy.svelte'
	import IntakeDate from '../components/IntakeDate.svelte'
	import CatnameDOBGenderAltered from '../components/AlteredWhenWhere.svelte'
	import BreedColorMarkings from '../components/BreedColorMarkings.svelte'
	import Microchip from '../components/Microchip.svelte'
	import ShotsFivTestedVetInfo from '../components/ShotsFIVTestedVetInfo.svelte'
	import OkWith from '../components/OkWith.svelte'
	import IntakeReason from '../components/IntakeReason.svelte'
	import Donation from '../components/Donation.svelte'
	import CourtesyListingNoRelinquishment from '../components/CourtesyListingNoRelinquishment.svelte'
	import TreatableMedical from '../components/TreatableMedical.svelte'
	import ShowNotWebOnly from '../components/ShowNotWebOnly.svelte'

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

	// Cat info
	// package for passing between components
	let cat = {
		okKinder: 'Unknown',
		okCats: 'Unknown'
	}

	onMount(() => {
		initSession()
		setSurrenderType(surrenderChoiceSurrender)
	})

	// TODO reflect Surrender form
	function surrenderHeaders() {
		return [
			'Intake Date',
			'Recvd From Name',
			'Drivers Lic',
			'Address',
			'Home Phone',
			'City',
			'State',
			'Zip',
			'Work/Cell Phone',
			'Email',
			'Intake Reason',
			'Donation Amount',
			'Donation Type',
			'F&F Representative'
		]

		// 	'Recvd From Phone',
		// 	'Recvd From Email',
		// 	'Intake Reason',

		// 	'Surrender/Stray/Transfer',
		// 	'Shelter Num',
		// 	'Relinq/Courtesy Listing',
		// 	'Show or Web Only',
		// 	'Rescue ID',
		// 	'Cat Name',
		// 	'Cat Age/DOB',
		// 	'Gender',
		// 	'altered/Intact',
		// 	'Breed',
		// 	'Hair length',
		// 	// readability marker
		// 	'Color',
		// 	'Current Weight',
		// 	'Est Size at Maturity',
		// 	'Distinctive Features',
		// 	'Spay/Neuter Date',
		// 	'Spay/Neuter Facility',
		// 	'RVRCP#1',
		// 	'RVRCP#2',
		// 	'RVRCP#3',
		// 	// readability marker
		// 	"Rabies Expires",
		// 	"FELV/FIV Test Date",
		// 	"FELV/FIV Pos/Neg",
		// 	"Microchip Num",
		// 	"Ok with Kids",
		// 	"Ok with Dogs",
		// 	"Ok with Cats",
		// 	"Bite History",
		// 	"Declawed",
		// 	"Special Needs",
		// 	"Temperament",
		// 	"Mother/Littermates",
		// 	"Known History",
		// 	"Internal-other Comments",
		// 	"Foster Home upon Intake"
		// ]
	}

	function surrenderValues() {
		return [
			$catPkg.intakeDate,
			$recvdFromPkg.fromName,
			$recvdFromPkg.driversLic,
			$recvdFromPkg.address,
			$recvdFromPkg.city,
			$recvdFromPkg.state,
			$recvdFromPkg.zip,
			$recvdFromPkg.email,

			$catPkg.intakeReason,
			$recvdFromPkg.donationAmount,
			$recvdFromPkg.donationForm,
			$catPkg.intakeFnFRepr
		]
		// ]
		// 		$catPkg.intakeReason,
		// 		'TBD',
		// 		'TBD',
		// 		'TBD',
		// 		'TBD',
		// 		'FigureThis',
		// 		$catPkg.catName,
		// 		$catPkg.DOB,
		// 		$catPkg.gender,
		// 		$catPkg.altered,
		// 		$catPkg.breed,
		// 		'TBD',
		// 		// readability marker
		// 		$catPkg.color,
		// 		"TBD",
		// 		"TBD",
		// 		"TBD",
		// 		"TBD",
		// 		"TBD",
		// 		"TBD",
		// 		"TBD",
		// 		"TBD",
		// 		// readability marker
		// 		"TBD",
		// 		"TBD",
		// 		"TBD",
		// 		$catPkg.microchipNum,
		// 		$catPkg.okKinder,
		// 		$catPkg.okCats,
		// 		$catPkg.okDogs.toString(),
		// 		"TBD",
		// 		"TBD",
		// 		$catPkg.specialNeeds,
		// 		"TBD",
		// 		"TBD",
		// 		"TBD",
		// 		"TBD",
		// 		"TBD foster home",
		// 	]
	}

	function copyFormToClipboard() {
		// Copy the CSV table to the clipboard.  From there you can paste into Excel.
		const csvStr = getInfoAsCSV([surrenderHeaders(), surrenderValues()])
		console.log('Copying %o', csvStr)
		navigator.clipboard.writeText(csvStr)
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
		const rqst = await fetch('/api/v1/owner_surrender_form', {
			method: 'POST',
			headers: { ...jwtSession(), 'Content-Type': 'application/json' },
			body: bodyJSON
		})

		if (rqst.status == 401) {
			// Unauthorized, or session has expired. -- need to redirect to login.
			// TODO maintain form state in a store, so it can be restored
			// on return.
			showLogin('Your session has expired.')
		} else if (rqst.status == 200) {
			const response = await rqst.json()
			console.log('Got response: %o', response)
		}
	}

	let formValid = false
	function getFormValid() {
		return true
	}
	$: formValid = getFormValid()
</script>

<Dialog bind:dialog={loginDialog} on:close={closeLoginDialog}>
	<LoginForm bind:loginReason close={closeLoginDialog} />
</Dialog>

<form on:submit|preventDefault={handleSubmit}>
	<IntakeDate /><br />
	<ReceivedFromName />
	<ReceivedFromDriversLic /> <br />
	<ReceivedFromContactInfo />

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
		<button type="submit" disabled={!formValid}>Submit</button>
		<button type="button" on:click={copyFormToClipboard}
			>Copy Surrender Form to Clipboard (Excel)</button
		>
	</div>
</form>
