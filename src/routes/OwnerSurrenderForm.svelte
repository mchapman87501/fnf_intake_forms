<script lang="ts">
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
	let catGender = 'M/F'
	let catAltered = false
	let catBreed = ''
	let catColor = ''
	let catMarkings = ''

	let catChipped = false
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

	function toggleCatChipped() {
		catChipped = !catChipped
	}

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

	function handleSubmit() {}
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

	<input type="text" placeholder="Name of cat" value={catName} />
	<input type="number" placeholder="DOB/Age" value={catDOBAge} />

	<select bind:value={catGender}>
		<option value="M">Male</option>
		<option value="F">Female</option>
	</select>
	<label><input type="checkbox" value={catAltered} /> altered</label><br />

	<input type="text" placeholder="Breed" value={catBreed} />
	<input type="text" placeholder="Color" value={catColor} />
	<input type="text" placeholder="Markings" value={catMarkings} /><br />

	<label
		><input type="checkbox" value={catChipped} on:change={toggleCatChipped} /> microchipped?</label
	>
	{#if catChipped}
		<input type="text" placeholder="Chip number" value={catChipNumber} pattern={catChipPattern} />
	{/if}
	<br />

	<div>
		{#each Object.values(CatShots) as shot}
			<label>
				<input type="checkbox" value={shot} on:change={() => toggleShot(shot)} />
				{shot}
			</label> &nbsp;
		{/each}
		<input type="text" placeholder="other shot(s)" value={catOtherShots} />
	</div>

	<label>
		<input type="checkbox" value={catFelvFivTested} on:change={toggleFelvFivStatus} />
		FEL/FIV Tested
	</label>

	{#if catFelvFivTested}
		<label>
			<input type="checkbox" value={catFFTestedPositive} /> Positive
		</label>
	{/if}
	<br />

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

	<hr />

	<div class="btns">
		<button type="reset">Reset</button>
		<button type="submit">Submit</button>
	</div>
</form>

<style>
	:global(:invalid) {
		color: red;
	}

	.lic_no {
		width: 9em;
	}

	label,
	span {
		font-size: 80%;
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

	.btns {
		text-align: center;
	}
</style>
