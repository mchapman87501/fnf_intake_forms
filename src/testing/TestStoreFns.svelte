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
		temp.DOB = `2018-01-01`
		temp.gender = genderChoices[2]
		temp.altered = uynChoices[1]
		temp.alteredDate =`2018-07-01`
		temp.alteredFacility ='Espanola'
		temp.breed = 'Siamese'
		temp.color = 'Sealpoint'
		temp.markings = 'White streak in brown of tail'
		temp.microchipped = uynChoices[1]
		temp.microchipNum = 'micro1234'

		temp.FELVFIVPositive = false
		temp.FELVFIVTested = true
		temp.FELVFIVTestedDate = `2019-01-01`
		temp.currentShots = true
		temp.namePrevVet = 'Dr Carealot'
		temp.phonePrevVet = 'phonevet'
		temp.dietMedications = ''
		temp.tameFeral = ''
		temp.biteHistory = false
		temp.declawed = false
		temp.illnessInjuryObs = 'no inj obs'
		temp.personalityObs = 'Siamese'
		temp.strayNotes = 'huggy but not friendly'
		temp.intakeNotes = 'very Siamese'

		temp.specialNeeds = 'SN Siamese'
		temp.okKinder = uynChoices[2]
		temp.okCats = uynChoices[1]
		temp.okDogs = uynChoices[1]

		temp.intakeReason = 'too pretty'
		temp.oKToShow = true
		temp.intakeFnFRepr = 'BDH',

		temp.FVRCP1 = `2000-01-01`
		temp.FVRCP2 = `2000-01-01`
		temp.FVRCP3 = `2000-01-01`
		temp.rabiesExpirationDate = `2024-01-01`
		temp.hairLength= 'short'
		temp.currentWeight= 'ok'
		temp.estMatureSize= 'beef'
		temp.distinctiveFeatures= 'yowl'
		temp.temperament= 'Siamese Traditional God Goblin'
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
		temp.address = '154 Tano Rd'
		temp.city = 'Santa Fe'
		temp.state = 'NM'
		temp.zip = '87555'
		temp.phone = '5058888888'
		temp.textOK = true
		temp.email = 'catcatcat@cat.cat'

		temp.donationAmount = '150'
		temp.donationForm = 'Visa'

		temp.surrenderType = surrenderChoices[1]
		temp.locationOfRescue = 'backyard'
		temp.shelterPrevID = 'EH12342018'
		temp.descriptionOfRescue = 'loved me then bit me'
		temp.shelterNum = 'EH'
		temp.courtesyListingNoRelinquishment = false
		temp.wantsMomBack = false

		recvdFromPkg.set(temp)
	}

	export function initializeCatPkgTest() {
		let temp = makeCatTestData()
		catPkg.set(temp)
	}
</script>
