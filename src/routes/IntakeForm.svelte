<script lang="ts">
	import { onMount } from 'svelte'

	import { catPkg, recvdFromPkg } from '../infrastructure/stores.js'
	import { getInfoAsCSV } from '../infrastructure/UtilFns.svelte'
	import { initSession } from '../infrastructure/StoreFns.svelte'
	import { surrenderChoices } from '../infrastructure/Definitions.svelte' //TODO
	import Dropdown from '../infrastructure/Dropdown.svelte'

	import OkWith from '../components/OkWith.svelte'
	import ReceivedFromName from '../components/ReceivedFromName.svelte'
	import ReceivedFromContactInfo from '../components/ReceivedFromContactInfo.svelte'
	import CatnameDOBGender from '../components/CatnameDOBGender.svelte'
	import BreedColorMarkings from '../components/BreedColorMarkings.svelte'
	import Microchip from '../components/Microchip.svelte'
	import IntakeReason from '../components/IntakeReason.svelte'
	import IntakeDate from '../components/IntakeDate.svelte'
	import ReceivedByName from '../components/ReceivedByName.svelte'
	import PrevShelterNum from '../components/PrevShelterNum.svelte'
	import ShowNotWebOnly from '../components/ShowNotWebOnly.svelte'
	import CourtesyListingNoRelinquishment from '../components/CourtesyListingNoRelinquishment.svelte'
	import AlteredWhenWhere from '../components/AlteredWhenWhere.svelte'
	import Declawed from '../components/Declawed.svelte'
	import PrevShelterBiteHistory from '../components/PrevShelterBiteHistory.svelte'
	import FVRCPDates from '../components/FVRCPDates.svelte'
	import RabiesExpirationDate from '../components/RabiesExpirationDate.svelte'
	import Temperament from '../components/Temperament.svelte'
	import MotherLittermates from '../components/MotherLittermates.svelte'
	import InternalComments from '../components/InternalComments.svelte'
	import FosterHomeOnIntake from '../components/FosterHomeOnIntake.svelte'
	import HairLength from '../components/HairLength.svelte'
	import CurrentWeight from '../components/CurrentWeight.svelte'
	import EstSizeMaturity from '../components/EstSizeMaturity.svelte'
	import DistinctiveFeatures from '../components/DistinctiveFeatures.svelte'
	import SpecialNeeds from '../components/SpecialNeeds.svelte'

	function getPrintMap() {
		var map = new Map()
		map.set('Intake date', $catPkg.intakeDate)
		map.set('Intake by', $catPkg.intakeFnFRepr)
		map.set('Received from', $recvdFromPkg.fromName)
		map.set('Phone', $recvdFromPkg.phone)
		map.set('Email', $recvdFromPkg.email)
		map.set('Intake reason', $catPkg.intakeReason)
		map.set('Intake type', $recvdFromPkg.surrenderType)
		map.set('Shelter Number', $recvdFromPkg.shelterNum)
		map.set(
			'Courtesy listing (no relinquishment)) ',
			$recvdFromPkg.courtesyListingNoRelinquishment.toString()
		)
		map.set('Ok to show (not Web only)', $catPkg.oKToShow.toString())
		map.set('Rescue ID', 'To do RESCUE ID')
		map.set('Name of cat', $catPkg.catName)
		map.set('DOB', $catPkg.DOB)
		map.set('Gender', $catPkg.gender)
		map.set('Breed', $catPkg.breed)
		map.set('Hair length', $catPkg.hairLength)
		map.set('Color', $catPkg.color)
		map.set('Current weight', $catPkg.currentWeight)
		map.set('Estimated size at maturity', $catPkg.estMatureSize)
		map.set('Distinctive features', $catPkg.distinctiveFeatures)
		map.set('Spay/Neuter date', $catPkg.alteredDate)
		map.set('Where done', $catPkg.alteredFacility)
		map.set('FVRCP#1', $catPkg.FVRCP1)
		map.set('FVRCP#2', $catPkg.FVRCP2)
		map.set('FVRCP#3', $catPkg.FVRCP3)
		map.set('Rabies expires', $catPkg.rabiesExpirationDate)
		map.set('FELV/FIV test date', $catPkg.FELVFIVTestedDate)
		map.set('Pos/Neg?', $catPkg.FELVFIVPositive.toString())
		map.set('Microchip #', $catPkg.microchipNum)
		map.set('Likes Dogs?', $catPkg.okDogs.toString())
		map.set('Likes Cats?', $catPkg.okCats.toString())
		map.set('Likes Kids?', $catPkg.okKinder.toString())
		map.set('Bite history?', $catPkg.biteHistory.toString())
		map.set('Declawed?', $catPkg.declawed.toString())
		map.set('Special Needs?', $catPkg.specialNeeds)
		map.set('Temperament:', $catPkg.temperament)
		map.set('Mother/Littermates:', $catPkg.motherLittermates)
		map.set('Known History', $catPkg.knownHistory)
		map.set('Other comments [internal use only]:', $catPkg.otherCommentsInternalUseOnly)
		map.set('Foster home on intake', $catPkg.fosterHomeOnIntake)
		map.set('Altered:', $catPkg.altered)
		map.set('Prevous shelter id', $recvdFromPkg.shelterPrevID)

		return map
	}
	function horizontalMap(map: Map<string, string>) {
		return [Array.from(map.keys()), Array.from(map.values())]
	}
	function verticalMap(map: Map<string, string>) {
		return Array.from(map.entries())
	}

	function getInfoAsTable(): Array<Array<string>> {
		// Use standard 'yyyy-mm-dd' value format of <input type="date"> -- i.e.,
		// use intakeDate as-is.
		var map = getPrintMap()
		// can use verticalMap(map) or horizontalMap(map)
		// how does user want to see/use it?
		return horizontalMap(map)
	}
	function copyFormToClipboard() {
		var m = getPrintMap()
		horizontalMap(m)
		// Copy the CSV table to the clipboard.  From there you can paste into Excel.
		const csvStr = getInfoAsCSV(getInfoAsTable())
		console.log('Copying %o', csvStr)
		navigator.clipboard.writeText(csvStr)
	}
	onMount(() => {
		initSession()
	})
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
	<IntakeDate /><br />
	<span>Received By <ReceivedByName /> </span><br />
	<span>Received From <ReceivedFromName /> </span><br />
	<ReceivedFromContactInfo /><br />
	<IntakeReason /><br />
	<Dropdown choiceList={surrenderChoices} bind:value={$recvdFromPkg.surrenderType} />
	<PrevShelterNum />
	<br />
	<CourtesyListingNoRelinquishment /><br />
	<ShowNotWebOnly /><br />
	TBD - RESCUE ID from where<br />

	<CatnameDOBGender /><br />
	<BreedColorMarkings /><br />
	<HairLength /><br />
	<CurrentWeight /><br />
	<EstSizeMaturity /><br />
	<DistinctiveFeatures /><br />
	<AlteredWhenWhere /><br />
	<FVRCPDates /><br />
	<RabiesExpirationDate /><br />
	<Microchip /><br />
	<!-- TBD - FELV/FIV test date and result - what if not tested?<br /> -->
	<OkWith /><br />
	<PrevShelterBiteHistory />
	<Declawed /><br />
	<SpecialNeeds /><br />
	<Temperament /><br />
	<MotherLittermates /><br />
	<InternalComments /><br />
	<FosterHomeOnIntake /><br />

	<div class="btns">
		<button type="submit" disabled={!formValid}>Submit</button>
		<button type="button" on:click={copyFormToClipboard}
			>Copy Intake Form to Clipboard (Excel)</button
		>
	</div>
</form>

<style>
	.btns {
		text-align: center;
	}
	span {
		font-size: 75%;
	}
</style>
