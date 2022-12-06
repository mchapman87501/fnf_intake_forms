<script lang="ts">
	import { onMount } from 'svelte';

	import Dropdown from '../components/Dropdown.svelte'
	import Radiobuttons from '../components/Radiobuttons.svelte'
	import Checkbox from '../components/Checkbox.svelte'

	import { catPkg } from '../components/stores.js'

	import { uynChoices, genderChoices, alteredChoices } from '../components/Definitions.svelte'
	import { initSession } from '../components/StoreFns.svelte'
	import { getInfoAsCSV, todayStr } from '../components/UtilFns.svelte'

	let ownerNamePlaceholder = 'Owner/Guardian Name'

	
	let currUser = '(F&F representative)'
	onMount( ()=>{initSession()});

	//-----------------------
	// Owner info
	let driverLicNo = ''
	let dlPattern = '\\d{9}'

	let streetAddr = ''
	let homePhone = ''
	let city = ''
	let state = ''
	let zipCode = ''
	let zipCodePattern = '\\d{5}'
	let workOrCell = ''

	//----------------------
	// Cat info
	let catMarkings = ''

	let catChipped = 'Unknown'

	enum CatShots {
		FVRCP = 'FVRCP',
		FELV = 'FeLV',
		Rabies = 'Rabies',
		Bordetella = 'Bordetella'
	}

	let catCurrentShots: Set<CatShots> = new Set()
	let catOtherShots = ''

	let catFelvFivTested = false
	let catFFTestedPositive = false

	let vetName = ''
	let vetPhone = ''

	let catMeds = ''

	let donationAmt = ''
	let donationPattern = '\\d+(\\.\\d{2})?'

	function toggleShot(shot: CatShots) {
		console.debug('Toggle %o', shot)
		if (catCurrentShots.has(shot)) {
			catCurrentShots.delete(shot)
		} else {
			catCurrentShots.add(shot)
		}
	}

	function toggleFelvFivStatus() {
		catFelvFivTested = !catFelvFivTested
	}

	function getIntakeInfoAsTable(): Array<Array<string>> {
		// Use standard 'yyyy-mm-dd' value format of <input type="date"> -- i.e.,
		// use intakeDate as-is.
		return [catPkgHeaders(), catPkgValues()]
	}
	// TODO reflect Surrender form ASK user
	function catPkgHeaders() {
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
			"Rabies Expires",
			"FELV/FIV Test Date",
			"FELV/FIV Pos/Neg",
			"Microchip Num",
			"Ok with Kids",
			"Ok with Dogs",
			"Ok with Cats",
			"Bite History",
			"Declawed",
			"Special Needs",
			"Temperament",
			"Mother/Littermates",
			"Known History",
			"Internal-other Comments",
			"Foster Home upon Intake"
		]
	}
	function catPkgValues() {
		return [
			$catPkg.recdFromName,
			$catPkg.recdFromPhone,
			$catPkg.recdFromEmail,
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
			"TBD",
			"TBD",
			"TBD",
			"TBD",
			"TBD",
			"TBD",
			"TBD",
			"TBD",
			// readability marker
			"TBD",
			"TBD",
			"TBD",
			$catPkg.microchipNum,
			$catPkg.okKinder,
			$catPkg.okCats,
			$catPkg.okDogs.toString(),
			"TBD",
			"TBD",
			$catPkg.specialNeeds,
			"TBD",
			"TBD",
			"TBD",
			"TBD",
			"TBD foster home",
		]
	}

	function copyFormToClipboard() {
		// Copy the CSV table to the clipboard.  From there you can paste into Excel.
		const csvStr = getInfoAsCSV([catPkgHeaders(), catPkgValues()])
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

	<input bind:value={$catPkg.recdFromName} placeholder={ownerNamePlaceholder} />
	<input type="date" bind:value={$catPkg.intakeDate} /><br />

	<input
		class="lic_no"
		value={driverLicNo}
		placeholder="Driver's License #"
		pattern={dlPattern}
	/><br />

	<input type="text" placeholder="Street Address" bind:value={streetAddr} />
	<!-- TODO should Intake.svelte use Home, Cell or logic of two  -->
	<input type="tel" placeholder="Home phone" bind:value={$catPkg.recdFromPhone} /><br />

	<input type="text" placeholder="City" bind:value={city} />

	<!-- TODO use a menu -->
	<input type="text" class="state_abbrev" placeholder="State" bind:value={state} />
	<input
		type="text"
		class="zipcode"
		placeholder="Zip code"
		pattern={zipCodePattern}
		value={zipCode}
	/>
	<input type="tel" placeholder="Work/Cell phone" bind:value={workOrCell} /><br />
	<input type="email" placeholder="Email Address" bind:value={$catPkg.recdFromEmail} />

	<hr />

	<input class="name" type="text" placeholder="Cat's name" bind:value={$catPkg.catName} />
	<input class="dob_age" type="text" placeholder="DOB/Age" bind:value={$catPkg.age} />

	<!-- TODO gender/altered is combined on paper forms - note this -->
	<!-- TODO intialize items with custom lists with list default -->
	<Dropdown choiceList={genderChoices} bind:value={$catPkg.gender} />

	<Dropdown choiceList={alteredChoices} bind:value={$catPkg.altered} />
	<br />

	<input type="text" placeholder="Breed" bind:value={$catPkg.breed} />
	<input type="text" placeholder="Color" bind:value={$catPkg.color} />
	<input type="text" placeholder="Markings" bind:value={catMarkings} /><br />

	<select bind:value={catChipped}>
		<option value="Unknown">Microchipped Unknown</option>
		<option value="True">Chipped</option>
		<option value="False">Not Chipped</option>
	</select>
	<br />
	{#if catChipped == 'True'}
		<input type="text" placeholder="Chip number" bind:value={$catPkg.microchipNum} />
	{/if}
	<br />

	<div class="shots_and_tests">
		{#each Object.values(CatShots) as shot}
			<label>
				<input type="checkbox" bind:value={shot} on:change={() => toggleShot(shot)} />
				{shot}
			</label> &nbsp;
		{/each}
		<input class="other_shots" type="text" placeholder="other shot(s)" bind:value={catOtherShots} />
		<br />
		<label>
			<input type="checkbox" bind:value={catFelvFivTested} on:change={toggleFelvFivStatus} />
			FEL/FIV Tested
		</label>

		{#if catFelvFivTested}
			<label>
				<input type="checkbox" bind:value={catFFTestedPositive} /> Positive
			</label>
		{/if}
	</div>

	<input type="text" placeholder="Name of Previous Vet" bind:value={vetName} />
	<input type="tel" placeholder="Vet phone" bind:value={vetPhone} /><br />

	<span>Special needs/habits:</span><br />
	<textarea bind:value={$catPkg.specialNeeds} /><br />

	<span>Current diet/medications:</span><br />
	<textarea>{catMeds}</textarea><br />

	<div>
		<fieldset class="fieldset-auto-width">
			<Dropdown title={'OK with kids?'} choiceList={uynChoices} bind:value={$catPkg.okKinder} />
		</fieldset>

		<fieldset class="fieldset-auto-width">
			<Radiobuttons title={'OK with cats?'} bind:group={$catPkg.okCats} />
		</fieldset>

		<span>OK with</span>
		<label><input type="checkbox" bind:checked={$catPkg.okDogs} /> dogs</label>
	</div>

	<span>Reason for surrender:</span><br />
	<textarea bind:value={$catPkg.intakeReason} /><br />

	<p class="rep">
		<input
			class="currency"
			type="text"
			placeholder="Donation"
			value={donationAmt}
			pattern={donationPattern}
		/>
		Surrender accepted by
		<input type="text" placeholder={currUser} bind:value={$catPkg.intakeFnFRepr} />
	</p>

	<hr />

	<div class="btns">
		<button type="submit" disabled={!formValid}>Submit</button>
		<button type="button" on:click={copyFormToClipboard}>Copy Excel to Clipboard</button>
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
