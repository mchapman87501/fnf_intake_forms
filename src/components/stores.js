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
    breed: '',
    color: '',
    gender : 'Unknown',
    okKinder: 'Unknown',
    okCats: 'Unknown'
}
export const catInfoPkg = writable(cat);