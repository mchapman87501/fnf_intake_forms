<script lang="ts">
	import { session_token, jwtSession } from '$lib/hooks/auth'
	import Dialog from '$lib/components/Dialog.svelte'
	import LoginForm from '$lib/components/LoginForm.svelte'
	export let selected_form
	export let FormType

	import Comp_ynu_dropdown from './Comp_ynu_dropdown.svelte'
	import Comp_ynu_radiobuttons from './Comp_ynu_radiobuttons.svelte'

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

	//Customize form based on selected_form FormType
	let ownerNamePlaceholder = 'Owner/Guardian Name'
	if (selected_form == FormType.Rescuer) ownerNamePlaceholder = 'Rescue Organization Name'

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
	let acceptingUser = ''

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
	let catName = ''
	let catDOBAge = ''

	let catGender = 'F/M Unknown'
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
			[catName, acceptingUser, surrDate, cat.okKinder, cat.okCats]
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

	let formEl: HTMLFormElement

	function dataFromForm(): any {
		// Without this arcane definition, 'result[name] = value' generates TS error 7503.
		let result: { [index: string]: string } = {}

		// This is fragile...
		const tags = ['input', 'select', 'textarea']
		for (const childTag of tags) {
			const elements = Array.from(formEl.getElementsByTagName(childTag))
			elements.forEach((node: Node) => {
				const el = node as HTMLInputElement
				if (el !== null && el !== undefined) {
					let name = el.name
					let value = el.value
					if (name != '' && name !== undefined && value !== undefined) {
						result[name] = value
					}
				}
			})
		}
		return result
	}

	const backendBaseURL = '/api/v1'

	async function handleSubmit() {
		const bearerToken = $session_token
		if (bearerToken == null) {
			showLogin('You must be logged in to submit a form.')
			return
		}

		const bodyData = dataFromForm()
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
		console.log('valid tested')
		return true
	}
	$: formValid = getFormValid()

	let uynChoices = ['Unknown', 'Yes', 'No']

	let genderChoices = ['F/M Unknown', 'Female', 'Male']

	let alteredChoices = ['Spay/Neuter Unknown', 'Spayed/Neutered', 'Intact']
</script>

<Dialog bind:dialog={loginDialog} on:close={closeLoginDialog}>
	<LoginForm bind:loginReason close={closeLoginDialog} />
</Dialog>

<form bind:this={formEl} on:submit|preventDefault={handleSubmit}>
	<input name="owner_name" bind:value={ownerName} placeholder={ownerNamePlaceholder} />
	<input name="surrender_date" type="date" bind:value={surrDate} /><br />

	<input
		name="drivers_license_no"
		class="lic_no"
		bind:value={driverLicNo}
		placeholder="Driver's License #"
		pattern={dlPattern}
	/><br />

	<input name="street_address" type="text" placeholder="Street Address" bind:value={streetAddr} />
	<input name="home_phone" type="tel" placeholder="Home phone" bind:value={homePhone} /><br />

	<input name="city" type="text" placeholder="City" bind:value={city} />

	<!-- TODO use a menu -->
	<input name="state" type="text" class="state_abbrev" placeholder="State" bind:value={state} />
	<input
		name="zipcode"
		type="text"
		class="zipcode"
		placeholder="Zip code"
		pattern={zipCodePattern}
		value={zipCode}
	/>
	<input name="work_phone" type="tel" placeholder="Work/Cell phone" bind:value={workOrCell} /><br />
	<input name="email_addr" type="email" placeholder="Email Address" bind:value={emailAddr} />

	<hr />

	<input name="cat_name" class="name" type="text" placeholder="Cat's name" bind:value={catName} />
	<input name="cat_age" class="dob_age" type="text" placeholder="DOB/Age" bind:value={catDOBAge} />

	<Comp_ynu_dropdown choiceList={genderChoices} bind:value={catGender} />

	<select name="cat_gender" bind:value={catGender}>
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

	<input type="text" placeholder="Breed" bind:value={catBreed} />
	<input type="text" placeholder="Color" bind:value={catColor} />
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
		<!--   Duplicated inputs methods on the same field
    for demo/refactor purposes
    Also, it is cool to watch them
    synchronize 
    Also, reminder to pass/share styles with components-->
		<fieldset class="fieldset-auto-width">
			<Comp_ynu_dropdown
				title={'OK with kids?'}
				choiceList={uynChoices}
				bind:value={cat.okKinder}
			/>
		</fieldset>

		<fieldset class="fieldset-auto-width">
			<legend>Ok with Kids:</legend>
			<label>
				<input
					type="radio"
					bind:group={cat.okKinder}
					name="cat.OKKinder"
					value={'Unknown'}
				/>Unknown
			</label>
			<label>
				<input type="radio" bind:group={cat.okKinder} name="cat.OKKinder" value={'Yes'} />Yes
			</label>
			<label>
				<input type="radio" bind:group={cat.okKinder} name="cat.OKKinder" value={'No'} />No
			</label>
		</fieldset>

		<fieldset class="fieldset-auto-width">
			<Comp_ynu_radiobuttons title={'OK with cats?'} bind:group={cat.okCats} />
		</fieldset>

		<span>OK with</span>
		<label><input type="checkbox" bind:checked={catOKDogs} /> dogs</label>
	</div>

	<span>Reason for surrender:</span><br />
	<textarea name="reason_for_surrender">{reasonForSurrender}</textarea><br />

	<p class="rep">
		<input
			class="currency"
			type="text"
			placeholder="Donation"
			value={donationAmt}
			pattern={donationPattern}
		/>
		Surrender accepted by
		<input name="accepting_user" type="text" placeholder={currUser} bind:value={acceptingUser} />
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
	legend,
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
