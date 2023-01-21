// Following along with
// https://ashutosh.dev/how-to-do-authentication-in-svelte-using-store/

import { writable } from 'svelte/store'
import { browser } from '$app/environment'

export const session_username = writable<string>(undefined)

// How to persist a writable store, cheaply?
// https://stackoverflow.com/a/71644127
// Use 'browser' to ensure this code runs only on the client.
if (browser && typeof localStorage !== 'undefined') {
	const initUsername = localStorage.getItem('session_username')
	if (initUsername != null) {
		session_username.set(initUsername)
	}
	session_username.subscribe((value) => {
		if (value !== undefined) {
			localStorage.setItem('session_username', value)
		}
	})

	window.setTimeout(async () => {
		let rqst = await fetch('/api/v1/check_in')
		if (!rqst.ok) {
			// Session is invalid.
			session_username.set('')
		}
	}, 10)
}
