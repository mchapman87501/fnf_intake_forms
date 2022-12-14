import { writable } from 'svelte/store';

//For automation for testing
//Shows a button to autopopulate the fields with known test data
//Export to csv compares exported values to the known test data
export const showTests = writable(true);
