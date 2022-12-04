import { writable } from 'svelte/store';

export const catInfo = writable('cat info');

let cat = {
    okKinder: 'Unknown',
    okCats: 'Unknown'
}
export const catInfoPkg = writable(cat);