<script lang="ts">
	import { onMount } from 'svelte'

	import Dropdown from '../components/Dropdown.svelte'
	import Radiobuttons from '../components/Radiobuttons.svelte'
	import Checkbox from '../components/Checkbox.svelte'

	import { catPkg, recvdFromPkg } from '../components/stores.js'
	
	import ReceivedFrom from '../components/ReceivedFrom.svelte'
	import ReceivedBy from '../components/ReceivedBy.svelte'

	import {
		uynChoices,
		genderChoices,
		alteredChoices,
		surrenderChoices,
		surrenderChoiceTransfer,
		surrenderChoiceSurrender,
		surrenderChoiceStray,
		okKidsChoices,
		okCatsChoices,
		microchippedChoiceChipped,
		microchippedChoices
	} from '../components/Definitions.svelte'
	import { initSession, setSurrenderType } from '../components/StoreFns.svelte'
	import { getInfoAsCSV, todayStr } from '../components/UtilFns.svelte'
	import IntakeDate from '../components/IntakeDate.svelte'
	import CatnameDobGenderAltered from '../components/CatnameDOBGenderAltered.svelte'
	import BreedColorMarkings from '../components/BreedColorMarkings.svelte'
	import Microchip from '../components/Microchip.svelte'
	import ShotsFivTestedVetInfo from '../components/ShotsFIVTestedVetInfo.svelte'
	import OkWith from '../components/OkWith.svelte'
	import IntakeReason from '../components/IntakeReason.svelte'
	import Donation from '../components/Donation.svelte'

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
		// 	'Altered/Intact',
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
			$recvdFromPkg.homePhone,
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
		// 		$catPkg.age,
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
	function handleSubmit() {
		return false // prevent reload
	}

	let formValid = false
	function getFormValid() {
		return true
	}
	$: formValid = getFormValid()
</script>

<form on:submit|preventDefault={handleSubmit}>
	<IntakeDate/><br/>
	<ReceivedFrom />

	<hr />

	<CatnameDobGenderAltered/><br/>
	<BreedColorMarkings/><br/>
	<Microchip/><br/>
	<ShotsFivTestedVetInfo/><br/>
	<OkWith/><br/>
	<IntakeReason/><br/>
	
	<hr />
	<Donation/>
	<ReceivedBy />

	<hr />

	<div class="btns">
		<button type="submit" disabled={!formValid}>Submit</button>
		<button type="button" on:click={copyFormToClipboard}
			>Copy Surrender Form to Clipboard (Excel)</button
		>
	</div>
</form>

<style>
	input:invalid,
	textarea:invalid {
		color: red;
	}

	.lic_no {
		width: 9em;
	}

	label,
	span {
		font-size: 75%;
	}

	textarea {
		width: 90%;
	}
	input[type='tel'] {
		width: 9em;
	}

	.zipcode {
		width: 5em;
	}
	.state_abbrev {
		width: 5em;
	}

	.name {
		width: 7em;
	}
	.dob_age {
		width: 5em;
	}

	div.shots_and_tests {
		margin: 0.5em 0;
	}

	.other_shots {
		width: 90%;
	}

	.currency {
		width: 4.5em;
		text-align: right;
	}

	p.rep {
		font-style: italic;
		font-size: 80%;
	}
	.btns {
		text-align: center;
	}
	.fieldset-auto-width {
		display: inline-block;
	}
</style>
