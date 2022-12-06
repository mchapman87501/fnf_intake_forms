import { writable } from 'svelte/store';

// Initialize on mount on first run only
// The user clears the forms after that
export const firstRun = writable(true);

// Information about the party from
// whom the cat was received
let  recvdFrom = {
    fromName: '',
    driversLic: '',
    address: '',
    homePhone: '',
    city:'',
    state:'',
    zip:'',
    workCellPhone:'',
    email: '',
    donationAmount:'',
    donationForm:'',
    surrenderType:'',
    dateOfRescue:'',
    locationOfRescue:'',
    descriptionOfRescue:'',
    shelterNum:'',
    wantsMomBack:'',   
}
export const recvdFromPkg = writable(recvdFrom);

// Information about the cat
let cat = {
   
    intakeDate: '',
    catName : '',
    age : '',
    gender : 'Unknown',
    altered :'Unknown',
    breed: '',
    color: '',
    markings: '',
    microchipped: '',
    microchipNum: '',
    FELVFIVTested:false,
    FELVFIVPositive:false,
    FELVFIVTestedDate: '',
    currentShots:false,
    namePrevVet:'',
    phonePrevVet:'',
    dietMedications:'',
    tameFeral:'',
    illnessInjuryObs:'',
    personalityObs:'',
    strayNotes:'',
    intakeNotes:'',
    specialNeeds:'',
    okKinder: 'Unknown',
    okCats: 'Unknown',
    okDogs: false,
    intakeReason: '',
    intakeFnFRepr: ''
}
export const catPkg = writable(cat);