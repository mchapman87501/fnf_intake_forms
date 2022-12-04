// Following along with 
// https://ashutosh.dev/how-to-do-authentication-in-svelte-using-store/

import { writable } from 'svelte/store'

export const session_token = writable(null)
export const session_username = writable('')

function isLoggedIn() {
    return ($session_username != null);
}