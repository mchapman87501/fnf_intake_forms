<script lang="ts">

	import Dropdown from '../components/Dropdown.svelte'
	import Radiobuttons from '../components/Radiobuttons.svelte'
	import Checkbox from '../components/Checkbox.svelte'
	import { catInfo } from '../components/stores.js'
	import { catInfoPkg } from '../components/stores.js'

	import { uynChoices,genderChoices } from '../components/definitions.svelte'

	let catColor = 'Unknown'

	let alteredChoices = ['Spay/Neuter Unknown', 'Spayed/Neutered', 'Intact']


	//Customize form based on selected_form FormType
	let ownerNamePlaceholder = 'Owner/Guardian Name'
	
	function todayStr(): string {
		function pad(s: string, len: number): string {
			const overPadded = '00000000' + s
			return overPadded.substring(overPadded.length - len)
		}
		// Satisfy browsers like chrome that require
		// 'yyyy-mm-dd' as their input.
		const today = new Date()
		const year = today.getFullYear()
		const month = today.getMonth() + 1
		const day = today.getDate()

		const yStr = pad(year.toFixed(0), 4)
		const mStr = pad(month.toFixed(0), 2)
		const dStr = pad(day.toFixed(0), 2)
		const result = `${yStr}-${mStr}-${dStr}`
		console.log('todayStr = %o', result)
		return result
	}

	let currUser = '(F&F representative)'
	let acceptingUser = currUser

	//-----------------------
	// Owner info
	let ownerName = ''
	let surrDate = todayStr()
	let driverLicNo = ''
	let dlPattern = '\\d{9}'

	let streetAddr = ''
	let homePhone = ''
	let city = ''
	let state = ''
	let zipCode = ''
	let zipCodePattern = '\\d{5}'
	let workOrCell = ''
	let emailAddr = ''

	//----------------------
	// Cat info
	let catDOBAge = ''

	let catGender = genderChoices[0]
	let catAltered = alteredChoices[0]

	let catBreed = ''
	let catMarkings = ''

	let catChipped = 'Unknown'
	let catChipNumber = ''
	let catChipPattern = '\\d+'

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

	let catSpecialNeeds = ''
	let catMeds = ''

	let catOKDogs = false

	let reasonForSurrender = ''

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
		// use surrDate as-is.
		return [
			['Name of Cat', 'Accepting User', 'Date', 'Ok with Children', 'OK with Cats'],
			[$catInfoPkg.name, acceptingUser, surrDate, $catInfoPkg.okKinder, $catInfoPkg.okCats]
		]
	}

	// Prototyping - this should be factored out.
	function getIntakeInfoAsCSV(): string {
		function valueToCSV(v: string): string {
			const quoted = v.replaceAll('"', '""')
			return `"${quoted}"`
		}

		function rowToStr(row: Array<string>): string {
			return row.map((col) => valueToCSV(col)).join(',')
		}

		return getIntakeInfoAsTable()
			.map((row) => rowToStr(row))
			.join('\n')
	}

	function copyIntakeFormToClipboard() {
		// Copy the CSV table to the clipboard.  From there you can paste into Excel.
		const csvStr = getIntakeInfoAsCSV()
		console.log('Copying %o', csvStr)
		navigator.clipboard.writeText(csvStr)
	}

	function handleSubmit() {
		console.log('Hello from handleSubmit')
		return false // prevent reload
	}

	let formValid = false
	function getFormValid() {
		console.log('valid tested')
		return true
	}
	$: formValid = getFormValid()
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input bind:value={ownerName} placeholder={ownerNamePlaceholder} />
	<input type="date" bind:value={surrDate} /><br />

	<input
		class="lic_no"
		value={driverLicNo}
		placeholder="Driver's License #"
		pattern={dlPattern}
	/><br />

	<input type="text" placeholder="Street Address" bind:value={streetAddr} />
	<input type="tel" placeholder="Home phone" bind:value={homePhone} /><br />

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
	<input type="email" placeholder="Email Address" bind:value={emailAddr} />

	<hr />

	<input class="name" type="text" placeholder="Cat's name" bind:value={$catInfoPkg.name} />
	<input class="dob_age" type="text" placeholder="DOB/Age" bind:value={catDOBAge} />

	<Dropdown choiceList={genderChoices} bind:value={$catInfoPkg.gender} />

	<Dropdown choiceList={alteredChoices} bind:value={catAltered} />
	<br />

	<input type="text" placeholder="Breed" bind:value={catBreed} />
	<input type="text" placeholder="Color" bind:value={$catInfo} />
	<input type="text" placeholder="Markings" bind:value={catMarkings} /><br />

	<select bind:value={catChipped}>
		<option value="Unknown">Microchipped Unknown</option>
		<option value="True">Chipped</option>
		<option value="False">Not Chipped</option>
	</select>
	<br />
	{#if catChipped == 'True'}
		<input
			type="text"
			placeholder="Chip number"
			bind:value={catChipNumber}
			pattern={catChipPattern}
		/>
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
	<textarea>{catSpecialNeeds}</textarea><br />

	<span>Current diet/medications:</span><br />
	<textarea>{catMeds}</textarea><br />

	<div>
		<fieldset class="fieldset-auto-width">
			<Dropdown title={'OK with kids?'} choiceList={uynChoices} bind:value={$catInfoPkg.okKinder} />
		</fieldset>

		<fieldset class="fieldset-auto-width">
			<Radiobuttons title={'OK with cats?'} bind:group={$catInfoPkg.okCats} />
		</fieldset>

		<span>OK with</span>
		<label><input type="checkbox" bind:checked={catOKDogs} /> dogs</label>
	</div>

	<span>Reason for surrender:</span><br />
	<textarea>{reasonForSurrender}</textarea><br />

	<p class="rep">
		<input
			class="currency"
			type="text"
			placeholder="Donation"
			value={donationAmt}
			pattern={donationPattern}
		/>
		Surrender accepted by
		<input type="text" placeholder={currUser} bind:value={acceptingUser} />
	</p>

	<hr />

	<div class="btns">
		<button type="reset">Reset</button>
		<button type="submit" disabled={!formValid}>Submit</button>
		<button type="button" on:click={copyIntakeFormToClipboard}>Copy Excel to Clipboard</button>
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
