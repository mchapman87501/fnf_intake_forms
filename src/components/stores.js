import { writable } from 'svelte/store';

export const catInfo = writable('cat info');

let cat = {
    recdFromName: '',
    recdFromPhone: '',
    recdFromEmail: '',
    intakeReason: '',
    intakeDate: '',
    intakeFnFRepr: '',
    catName : '',
    gender : 'Unknown',
    altered :'Unknown',
    breed: '',
    color: '',
    
    okCats: 'Unknown',
    okDogs: false,
    okKinder: 'Unknown'
}
export const catInfoPkg = writable(cat);