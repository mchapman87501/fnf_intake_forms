import { writable } from 'svelte/store';

//Initialize on mount only on first runfelv
export const firstRun = writable(true);
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
    surrenderType:'',
    shelterNum:'',
    dateOfRescue:'',
    locationOfRescue:'',
    descriptionOfRescue:'',
    wantsMomBack:'',   
    donationAmount:'',
    donationForm:''
}
export const recvdFromPkg = writable(recvdFrom);
let cat = {
   
    intakeReason: '',
    intakeDate: '',
    intakeFnFRepr: '',
    catName : '',
    age : '',
    gender : 'Unknown',
    altered :'Unknown',
    breed: '',
    color: '',
    okCats: 'Unknown',
    okDogs: false,
    okKinder: 'Unknown',
    microchipNum: '',
    FELVFIVTested:false,
    FELVFIVPositive:false,
    FELVFIVTestedDate: '',
    specialNeeds:''
}
export const catPkg = writable(cat);