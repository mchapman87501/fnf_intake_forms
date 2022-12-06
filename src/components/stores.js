import { writable } from 'svelte/store';

//Initialize on mount only on first run
export const firstRun = writable(true);
let recvdFrom = {
    recvdFromName: '',
    recvdFromDriversLic: '',
    recvdFromAddress: '',
    recvdFromHomePhone: '',
    recvdFromCity:'',
    recvdFromState:'',
    recvdFromZip:'',
    recvdFromWorkCellPhone:'',
    recvdFromEmail: '',
    recvdFromType:'',
    recvdFromShelterNum:'',
    recvdFromDateOfRescue:'',
    recvdFromLocationOfRescue:'',
    recvdFromDescriptionOfRescue:'',
    recvdFromWantsMomBack:'',   
    recvdFromDonationAmount:'',
    recvdFromDonationForm:''
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
    FELVFIVPositive:false,
    specialNeeds:''
}
export const catPkg = writable(cat);