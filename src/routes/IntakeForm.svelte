<script lang="ts">
	import { onMount } from 'svelte'

	import { catPkg, recvdFromPkg } from '../components/stores.js'

	import Dropdown from '../components/Dropdown.svelte'
	import { surrenderChoices, surrenderChoiceTransfer } from '../components/Definitions.svelte'
	import { initSession } from '../components/StoreFns.svelte'
	import { getInfoAsCSV } from '../components/UtilFns.svelte'

	import OkWith from '../components/OkWith.svelte'
	import ReceivedFromName from '../components/ReceivedFromName.svelte'
	import ReceivedFromContactInfo from '../components/ReceivedFromContactInfo.svelte'
	import CatnameDOBGenderAltered from '../components/CatnameDOBGenderAltered.svelte'
	import BreedColorMarkings from '../components/BreedColorMarkings.svelte'
	import Microchip from '../components/Microchip.svelte'
	import IntakeReason from '../components/IntakeReason.svelte'
	import IntakeDate from '../components/IntakeDate.svelte'
	import ReceivedBy from '../components/ReceivedBy.svelte'
	import PrevShelterInfo from '../components/PrevShelterInfo.svelte'

	function getPrintMap() {
		var map = new Map()
		map.set('Intake date',$catPkg.intakeDate)
		map.set('Intake by', $catPkg.intakeFnFRepr)
		map.set('Received from',$recvdFromPkg.fromName)
		map.set('Phone',$recvdFromPkg.phone)
		map.set('Email',$recvdFromPkg.email)
		map.set('Intake reason',$catPkg.intakeReason)
		map.set('Intake type',$recvdFromPkg.surrenderType)
		map.set('Shelter Number',$recvdFromPkg.shelterNum)
		map.set('Courtesy listing (no relinquishment)) ',$recvdFromPkg.courtesyListingNoRelinquishment.toString())
		map.set('Ok to show (not Web only)',$catPkg.oKToShow.toString())
		map.set('Rescue ID','To do RESCUE ID')
		map.set('Name of cat',$catPkg.catName)
		map.set('DOB',$catPkg.DOB)
		map.set('Gender',$catPkg.gender)
		map.set('Breed',$catPkg.breed)
		map.set('Hair length','To do')
		map.set('Color',$catPkg.color)
		map.set('Current weight','To do')
		map.set('Estimated size at maturity','To do')
		map.set('Distinctive features','To do')
		map.set('Spay/Neuter date',$catPkg.alteredDate)
		map.set('Where done',$catPkg.alteredFacility)
		map.set('FVRCP#1','To do')
		map.set('FVRCP#2','To do')
		map.set('FVRCP#3','To do')
		map.set('Rabies expires','To do')
		map.set('FELV/FIV test date',$catPkg.FELVFIVTestedDate)
		map.set('Pos/Neg?',$catPkg.FELVFIVPositive.toString())
		map.set('Microchip #',$catPkg.microchipNum)
		map.set('Likes Dogs?',$catPkg.okDogs.toString())
		map.set('Likes Cats?',$catPkg.okCats.toString())
		map.set('Likes Kids?',$catPkg.okKinder.toString())
		map.set('Bite history?',$catPkg.biteHistory.toString())
		map.set('Declawed?',$catPkg.declawed.toString())
		map.set('Special Needs?','To do')
		map.set('Temperament:','To do')
		map.set('Mother/Littermates:','To do')
		map.set('Known History','To do')
		map.set('Other comments [internal use only]:','To do')
		map.set('Altered:',$catPkg.altered)
		map.set('Prevous shelter id',$recvdFromPkg.shelterPrevID)
	
		return map
	}
	function horizontalMap(map: Map<string,string>)
	{
		return [ Array.from(map.keys()), Array.from(map.values())]
	}
	function verticalMap(map: Map<string,string>)
	{
		return Array.from(map.entries())
	}

	function getInfoAsTable(): Array<Array<string>> {
		// Use standard 'yyyy-mm-dd' value format of <input type="date"> -- i.e.,
		// use intakeDate as-is.
		var map = getPrintMap()
		// console.log(verticalMap(map))
		// console.log(horizontalMap(map))
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
	<ReceivedBy /><br />
	<ReceivedFromName />
	<ReceivedFromContactInfo /><br />
	<IntakeReason /><br />
	<Dropdown choiceList={surrenderChoices} bind:value={$recvdFromPkg.surrenderType} />
	{#if $recvdFromPkg.surrenderType == surrenderChoiceTransfer}
		<PrevShelterInfo />
	{/if}
	<br />
	<!-- TBD - relinquish/courtesy - from transfer?<br />
	TBD - show or web - from where?<br />
	TBD - RESCUE ID from where<br /> -->
	<CatnameDOBGenderAltered /><br />
	<BreedColorMarkings /><br />
	<!-- TBD - hair length - from where?<br />
	TBD - current weight - from where?<br />
	TBD - estimated weight at maturity - from where?<br />
	TBD - distinctive features - from where?<br />
	TBD - spay/neuter date - from where?<br />
	TBD - spay/neuter facility - from where?<br />
	TBD - FVRCP #1 - from where?<br />
	TBD - FVRCP #2 - from where?<br />
	TBD - FVRCP #3 - from where?<br />
	TBD - rabies expires - from where?<br /> -->
	<Microchip /><br />
	<!-- TBD - FELV/FIV test date and result - what if not tested?<br /> -->
	<OkWith /><br />
	<!-- TBD - bite history - from where?<br />
	TBD - declawed - from where?<br /> -->

	<span>Special needs/habits:</span><br />
	<textarea bind:value={$catPkg.specialNeeds} /><br />
	<!-- TBD - temperament - from where?<br />
	TBD - mother/littermates - from where?<br />
	TBD - known history - from where?<br />
	TBD - other notes (internal use only) - from where?<br />
	TBD - foster home upon intake - from where?<br /> -->

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
	textarea {
		width: 90%;
	}
</style>
