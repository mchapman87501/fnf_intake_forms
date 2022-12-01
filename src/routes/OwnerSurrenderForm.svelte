<script lang="ts">
	let currUser = '(F&F representative)'
	let acceptingUser = ''

	//-----------------------
	// Owner info
	let ownerName = ''
	let date: Date
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
	let catName = ''
	let catDOBAge = ''

	let catGender = 'Unknown'
	let catAltered = 'Unknown'

	let catBreed = ''
	let catColor = ''
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

	let catOKKinder = false
	let catOKCats = false
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
		const formatter = new Intl.DateTimeFormat('en-US')
		const nowStr = formatter.format(new Date())
		return [
			['Accepting User', 'Date'],
			[acceptingUser, nowStr]
		]
	}

	// Prototyping - this should be factored out.
	function getIntakeInfoAsHTMLTable(): string {
		function rowToHTML(row: Array<string>, cellType: string): string {
			const cells = row.map((col) => `<${cellType}>${col}</${cellType}>`).join('')
			return `<tr>${cells}</tr>`
		}
		const table = getIntakeInfoAsTable()
		const header = rowToHTML(table[0], 'th')
		const dataRows = table
			.slice(1)
			.map((row) => rowToHTML(row, 'td'))
			.join('')
		return '<table>' + header + dataRows + '</table>'
	}

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
	<input value={ownerName} placeholder="Owner/Guardian Name" />
	<input type="date" value={date} /><br />

	<input
		class="lic_no"
		value={driverLicNo}
		placeholder="Driver's License #"
		pattern={dlPattern}
	/><br />

	<input type="text" placeholder="Street Address" value={streetAddr} />
	<input type="tel" placeholder="Home phone" value={homePhone} /><br />

	<input type="text" placeholder="City" value={city} />

	<!-- TODO use a menu -->
	<input type="text" class="state_abbrev" placeholder="State" value={state} />
	<input
		type="text"
		class="zipcode"
		placeholder="Zip code"
		pattern={zipCodePattern}
		value={zipCode}
	/>
	<input type="tel" placeholder="Work/Cell phone" value={workOrCell} /><br />
	<input type="email" placeholder="Email Address" value={emailAddr} />

	<hr />

	<input class="name" type="text" placeholder="Cat's name" value={catName} />
	<input class="dob_age" type="text" placeholder="DOB/Age" value={catDOBAge} />

	<select bind:value={catGender}>
		<option value="Unknown">M/F Unknown</option>
		<option value="M">Male</option>
		<option value="F">Female</option>
	</select>

	<select bind:value={catAltered}>
		<option value="Unknown">Altered/Intact Unknown</option>
		<option value="Intact">Intact</option>
		<option value="Spayed/Neutered">Spayed/Neutered</option>
	</select>
	<br />

	<input type="text" placeholder="Breed" value={catBreed} />
	<input type="text" placeholder="Color" value={catColor} />
	<input type="text" placeholder="Markings" value={catMarkings} /><br />

	<select bind:value={catChipped}>
		<option value="Unknown">Microchipped Unknown</option>
		<option value="True">Chipped</option>
		<option value="False">Not Chipped</option>
	</select>
	<br />
	{#if catChipped == 'True'}
		<input type="text" placeholder="Chip number" value={catChipNumber} pattern={catChipPattern} />
	{/if}
	<br />

	<div class="shots_and_tests">
		{#each Object.values(CatShots) as shot}
			<label>
				<input type="checkbox" value={shot} on:change={() => toggleShot(shot)} />
				{shot}
			</label> &nbsp;
		{/each}
		<input class="other_shots" type="text" placeholder="other shot(s)" value={catOtherShots} />
		<br />
		<label>
			<input type="checkbox" value={catFelvFivTested} on:change={toggleFelvFivStatus} />
			FEL/FIV Tested
		</label>

		{#if catFelvFivTested}
			<label>
				<input type="checkbox" value={catFFTestedPositive} /> Positive
			</label>
		{/if}
	</div>

	<input type="text" placeholder="Name of Previous Vet" value={vetName} />
	<input type="tel" placeholder="Vet phone" value={vetPhone} /><br />

	<span>Special needs/habits:</span><br />
	<textarea>{catSpecialNeeds}</textarea><br />

	<span>Current diet/medications:</span><br />
	<textarea>{catMeds}</textarea><br />

	<div>
		<span>OK with</span>
		<label><input type="checkbox" value={catOKKinder} /> small children</label>
		<label><input type="checkbox" value={catOKCats} /> cats</label>
		<label><input type="checkbox" value={catOKDogs} /> dogs</label>
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
</style>
