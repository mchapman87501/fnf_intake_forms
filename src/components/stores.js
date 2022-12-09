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
    city:'',
    state:'',
    zip:'',
    phone:'',
    textOK:false,
    email: '',
    donationAmount:'',
    donationForm:'',
    surrenderType:'',
    locationOfRescue:'',
    descriptionOfRescue:'',
    shelterNum:'',
    shelterPrevID:'',
    courtesyListingNoRelinquishment: false,
    wantsMomBack:false,   
}
export const recvdFromPkg = writable(recvdFrom);

// Information about the cat
let cat = {
   
    intakeDate: '',
    catName : '',
    treatableMedical: false,
    DOB : '',
    gender : '',
    altered :'',
    alteredDate:'',
    alteredFacility:'',
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
    biteHistory: false,
    declawed: false,
    illnessInjuryObs:'',
    personalityObs:'',
    strayNotes:'',
    intakeNotes:'',
    specialNeeds:'',
    okKinder: '',
    okCats: '',
    okDogs: '',
    intakeReason: '',
    oKToShow: true,
    intakeFnFRepr: '',
    FVRCP1:'',
    FVRCP2:'',
    FVRCP3:'',
    rabiesExpirationDate:'',
    hairLength:'',
    currentWeight:'',
    estMatureSize:'',
    distinctiveFeatures:'',
    temperament:'',
    motherLittermates:'',
    knownHistory:'',
    otherCommentsInternalUseOnly:'',
    fosterHomeOnIntake:''
}
export const catPkg = writable(cat);