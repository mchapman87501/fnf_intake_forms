<script lang="ts" context="module">
	import {  cat, catPkg, recvdFromPkg } from '../infrastructure/stores'
	import { get } from 'svelte/store'
	import {
		uynChoices,
		genderChoices,
		surrenderChoices
	} from'../infrastructure/Definitions.svelte'
	export function populateWithTestData() {
		initializeCatPkgTest()
		initializeRecvdFromPkgTest()
	}
	export function makeCatTestData() {
		let temp = Object.assign({}, cat);
		temp.intakeDate = `2022-11-12`
		temp.catName = 'Still Frank'
		temp.intakeDate = `2022-01-01`
		temp.treatableMedical = false
		temp.DOB = `2000-01-01`
		temp.gender = genderChoices[2]
		temp.altered = uynChoices[1]
		temp.alteredDate =`2019-01-01`
		temp.alteredFacility =''
		temp.breed = ''
		temp.color = ''
		temp.markings = ''
		temp.microchipped = uynChoices[0]
		temp.microchipNum = ''

		temp.FELVFIVPositive = false
		temp.FELVFIVTested = false
		temp.FELVFIVTestedDate = `2000-01-01`
		temp.currentShots = false
		temp.namePrevVet = ''
		temp.phonePrevVet = ''
		temp.dietMedications = ''
		temp.tameFeral = ''
		temp.biteHistory = false
		temp.declawed = false
		temp.illnessInjuryObs = ''
		temp.personalityObs = ''
		temp.strayNotes = ''
		temp.intakeNotes = ''

		temp.specialNeeds = ''
		temp.okKinder = uynChoices[0]
		temp.okCats = uynChoices[0]
		temp.okDogs = uynChoices[0]

		temp.intakeReason = ''
		temp.oKToShow = true
		temp.intakeFnFRepr = '(F & F representative)',

		temp.FVRCP1 = `2000-01-01`
		temp.FVRCP2 = `2000-01-01`
		temp.FVRCP3 = `2000-01-01`
		temp.rabiesExpirationDate = `2000-01-01`
		temp.hairLength= ''
		temp.currentWeight= ''
		temp.estMatureSize= ''
		temp.distinctiveFeatures= ''
		temp.temperament= ''
		temp.motherLittermates= ''
		temp.knownHistory= ''
		temp.otherCommentsInternalUseOnly= ''
		temp.fosterHomeOnIntake= ''
		return temp
	}

	export function initializeRecvdFromPkgTest() {
		
		let temp = get(recvdFromPkg)
		temp.fromName = 'A concerned person'
		temp.driversLic = 'dl1'
		temp.address = ''
		temp.city = ''
		temp.state = ''
		temp.zip = ''
		temp.phone = ''
		temp.textOK = false
		temp.email = ''

		temp.donationAmount = ''
		temp.donationForm = ''

		temp.surrenderType = surrenderChoices[0]
		temp.locationOfRescue = ''
		temp.shelterPrevID = ''
		temp.descriptionOfRescue = ''
		temp.shelterNum = ''
		temp.courtesyListingNoRelinquishment = false
		temp.wantsMomBack = false

		recvdFromPkg.set(temp)
	}

	export function initializeCatPkgTest() {
		let temp = makeCatTestData()
		catPkg.set(temp)
	}
</script>
