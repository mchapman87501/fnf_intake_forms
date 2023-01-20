<script lang="ts">
	import { catPkg, recvdFromPkg } from '$lib/infrastructure/stores.js'
	import { getInfoAsCSV } from '$lib/infrastructure/UtilFns.svelte'

	import OkWith from '$lib/components/OkWith.svelte'
	import ReceivedFromName from '$lib/components/ReceivedFromName.svelte'
	import ReceivedFromContactInfo from '$lib/components/ReceivedFromContactInfo.svelte'
	import CatnameDOBGender from '$lib/components/CatnameDOBGender.svelte'
	import BreedColorMarkings from '$lib/components/BreedColorMarkings.svelte'
	import Microchip from '$lib/components/Microchip.svelte'
	import IntakeReason from '$lib/components/IntakeReason.svelte'
	import IntakeDate from '$lib/components/IntakeDate.svelte'
	import ReceivedByName from '$lib/components/ReceivedByName.svelte'
	import PrevShelterNum from '$lib/components/PrevShelterNum.svelte'
	import ShowNotWebOnly from '$lib/components/ShowNotWebOnly.svelte'
	import CourtesyListingNoRelinquishment from '$lib/components/CourtesyListingNoRelinquishment.svelte'
	import AlteredWhenWhere from '$lib/components/AlteredWhenWhere.svelte'
	import Declawed from '$lib/components/Declawed.svelte'
	import PrevShelterBiteHistory from '$lib/components/PrevShelterBiteHistory.svelte'
	import FVRCPDates from '$lib/components/FVRCPDates.svelte'
	import RabiesExpirationDate from '$lib/components/RabiesExpirationDate.svelte'
	import Temperament from '$lib/components/Temperament.svelte'
	import MotherLittermates from '$lib/components/MotherLittermates.svelte'
	import InternalComments from '$lib/components/InternalComments.svelte'
	import FosterHomeOnIntake from '$lib/components/FosterHomeOnIntake.svelte'
	import HairLength from '$lib/components/HairLength.svelte'
	import CurrentWeight from '$lib/components/CurrentWeight.svelte'
	import EstSizeMaturity from '$lib/components/EstSizeMaturity.svelte'
	import DistinctiveFeatures from '$lib/components/DistinctiveFeatures.svelte'
	import SpecialNeeds from '$lib/components/SpecialNeeds.svelte'
	import SurrenderType from '$lib/components/SurrenderType.svelte'
	import { query_selector_all } from 'svelte/internal'

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
	function handleSubmit() {
		return false // prevent reload
	}

	let formValid = false
	function getFormValid() {
		return true
	}
	$: formValid = getFormValid()
	const uploadInput = <HTMLInputElement>document.getElementById('uploadInput')
	if (uploadInput != null) {
		uploadInput.addEventListener(
			'change',
			() => {
				console.log('change')
				// Calculate total size
				let numberOfBytes = 0
				if (uploadInput.files != null) {
					for (const file of uploadInput.files) {
						numberOfBytes += file.size
					}

					// Approximate to the closest prefixed unit
					const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
					const exponent = Math.min(
						Math.floor(Math.log(numberOfBytes) / Math.log(1024)),
						units.length - 1
					)
					const approx = numberOfBytes / 1024 ** exponent
					const output =
						exponent === 0
							? `${numberOfBytes} bytes`
							: `${approx.toFixed(3)} ${units[exponent]} (${numberOfBytes} bytes)`

					let fileNumElm = <HTMLInputElement>document.getElementById('fileNum')
					if (fileNumElm != null) {
						fileNumElm.textContent = uploadInput.files.length.toString()
					}
					let filesizeElm = <HTMLInputElement>document.getElementById('fileSize')
					if (filesizeElm != null) {
						filesizeElm.textContent = output
					}
				}
			},
			false
		)
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<IntakeDate /><br />
	<span>Received By <ReceivedByName /> </span><br />
	<span>Received From <ReceivedFromName /> </span><br />
	<ReceivedFromContactInfo /><br />
	<IntakeReason /><br />
	<SurrenderType />
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
	<h1>Vanilla JS Drag & Drop upload zone for input file element</h1>

	<div>
		<label for="uploadInput">Choose file to upload</label>
		<input type="file" id="fileinput" name="fileinput" bind:value={$catPkg.profilePic} multiple />
		<label for="fileNum">Selected files:</label>
		<output id="fileNum">0</output>;
		<label for="fileSize">Total size:</label>
		<output id="fileSize">0</output>
	</div>
	<div class="btns">
		<button type="submit" disabled={!formValid}>Submit</button>
		<button type="button" on:click={copyFormToClipboard}
			>Copy Intake Form to Clipboard (Excel)</button
		>
	</div>
	<p>{$catPkg.profilePic}</p>
	<img src={$catPkg.profilePic} alt="A Cat" />
</form>

<style>
	.btns {
		text-align: center;
	}
	span {
		font-size: 75%;
	}
</style>
