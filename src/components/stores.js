import { writable } from 'svelte/store';

let cat = {
    recdFromName: '',
    recdFromPhone: '',
    recdFromEmail: '',
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