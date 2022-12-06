<script lang="ts">
	import { onMount } from 'svelte'

	import { catPkg, recvdFromPkg } from '../components/stores.js'
	import Dropdown from '../components/Dropdown.svelte'
	import Radiobuttons from '../components/Radiobuttons.svelte'
	import { uynChoices, genderChoices, alteredChoices } from '../components/Definitions.svelte'
	import { initSession } from '../components/StoreFns.svelte'
	import { getInfoAsCSV } from '../components/UtilFns.svelte'

	function catPkgHeadersIntake() {
		return [
			'Recvd From Name',
			'Recvd From Phone',
			'Recvd From Email',
			'Intake Reason',
			'Surrender/Stray/Transfer',
			'Shelter Num',
			'Relinq/Courtesy Listing',
			'Show or Web Only',
			'Rescue ID',
			'Cat Name',
			'Cat Age/DOB',
			'Gender',
			'Altered/Intact',
			'Breed',
			'Hair length',
			// readability marker
			'Color',
			'Current Weight',
			'Est Size at Maturity',
			'Distinctive Features',
			'Spay/Neuter Date',
			'Spay/Neuter Facility',
			'RVRCP#1',
			'RVRCP#2',
			'RVRCP#3',
			// readability marker
			'Rabies Expires',
			'FELV/FIV Test Date',
			'FELV/FIV Pos/Neg',
			'Microchip Num',
			'Ok with Kids',
			'Ok with Dogs',
			'Ok with Cats',
			'Bite History',
			'Declawed',
			'Special Needs',
			'Temperament',
			'Mother/Littermates',
			'Known History',
			'Internal-other Comments',
			'Foster Home upon Intake'
		]
	}
	function catPkgValuesIntake() {
		return [
			$recvdFromPkg.recvdFromName,
			$recvdFromPkg.recvdFromHomePhone,
			$recvdFromPkg.recvdFromEmail,
			$catPkg.intakeReason,
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			'FigureThis',
			$catPkg.catName,
			$catPkg.age,
			$catPkg.gender,
			$catPkg.altered,
			$catPkg.breed,
			'TBD',
			// readability marker
			$catPkg.color,
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			// readability marker
			'TBD',
			'TBD',
			'TBD',
			$catPkg.microchipNum,
			$catPkg.okKinder,
			$catPkg.okCats,
			$catPkg.okDogs.toString(),
			'TBD',
			'TBD',
			$catPkg.specialNeeds,
			'TBD',
			'TBD',
			'TBD',
			'TBD',
			'TBD foster home'
		]
	}
	function getInfoAsTable(): Array<Array<string>> {
		// Use standard 'yyyy-mm-dd' value format of <input type="date"> -- i.e.,
		// use intakeDate as-is.
		return [catPkgHeadersIntake(), catPkgValuesIntake()]
	}
	function copyFormToClipboard() {
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
</script>

<form on:submit|preventDefault={handleSubmit}>

	<div class="fieldset-auto-width">
		<label
			>Received:
			<!-- TODO: initialize/synchronize intake date  -->
			<input class="name" type="date" placeholder="Intake date" bind:value={$catPkg.intakeDate} />
		</label>
		<label
			>By:
			<input class="name" type="text" placeholder="Name" bind:value={$catPkg.intakeFnFRepr} />
		</label>
	</div>
	<div>
		<label
			>From:
			<input class="name" type="text" placeholder="Name" bind:value={$recvdFromPkg.recvdFromName} />
			<input class="name" type="text" placeholder="Email" bind:value={$recvdFromPkg.recvdFromEmail} />
			<input class="name" type="text" placeholder="Phone" bind:value={$recvdFromPkg.recvdFromHomePhone} />
		</label>
		<label
			>Reason:
			<input
				class="name"
				type="text"
				placeholder="Intake reason"
				bind:value={$catPkg.intakeReason}
			/>
		</label>
	</div>
	<br />
	<label
		>Cat's name:
		<input class="name" type="text" placeholder="Cat's name" bind:value={$catPkg.catName} />
		<input type="text" placeholder="Age" bind:value={$catPkg.age} />
		<Dropdown choiceList={genderChoices} bind:value={$catPkg.gender} />
		<Dropdown choiceList={alteredChoices} bind:value={$catPkg.altered} />
		<input type="text" placeholder="Breed" bind:value={$catPkg.breed} />
		<input type="text" placeholder="Color" bind:value={$catPkg.color} />
	</label>
	<!-- TODO must coordinate with Microchipped flag in OwnerSurrenderForm.svelte -->
	<!-- <input type="text" placeholder="Chip number" bind:value={$catPkg.microchipNum} /> -->

	<!-- TODO must coordinate with FELFIVTested toggle in OwnerSurrenderForm.svelte -->
	<!-- <label>
		<input type="checkbox" bind:value={$catPkg.FELVFIVPositive} /> FELV/FIV Positive
	</label> -->

	<div>
		<fieldset class="fieldset-auto-width">
			<Radiobuttons title={'OK with cats?'} bind:group={$catPkg.okCats} />
		</fieldset>
		<span>OK with</span>
		<label><input type="checkbox" bind:checked={$catPkg.okDogs} /> dogs</label>
		<fieldset class="fieldset-auto-width">
			<Dropdown title={'OK with kids?'} choiceList={uynChoices} bind:value={$catPkg.okKinder} />
		</fieldset>
	</div>
	<span>Special needs/habits:</span><br />
	<textarea bind:value={$catPkg.specialNeeds} /><br />

	<div class="btns">
		<button type="submit" disabled={!formValid}>Submit</button>
		<button type="button" on:click={copyFormToClipboard}
			>Copy Excel of Intake Form to Clipboard</button
		>
	</div>
</form>

<style>
	.btns {
		text-align: center;
	}
	label {
		font-size: 75%;
	}
	.fieldset-auto-width {
		display: inline-block;
	}
</style>
