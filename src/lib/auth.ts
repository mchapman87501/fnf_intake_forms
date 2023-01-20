// Following along with
// https://ashutosh.dev/how-to-do-authentication-in-svelte-using-store/

import { writable, get } from 'svelte/store'
import { browser } from '$app/environment'

export const session_token = writable<string>(undefined)
export const session_username = writable<string>(undefined)

// How to persist a writable store, cheaply?
// https://stackoverflow.com/a/71644127
// Use 'browser' to ensure this code runs only on the client.
if (browser && typeof localStorage !== 'undefined') {
	const initSessToken = localStorage.getItem('session_token')
	if (initSessToken != null) {
		session_token.set(initSessToken)
	}
	session_token.subscribe((value) => {
		if (value !== undefined) {
			localStorage.setItem('session_token', value)
		}
	})

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
		let rqst = await fetch('/api/v1/check_in', { headers: jwtSession() })
		if (!rqst.ok) {
			// Session is invalid.
			session_token.set('')
			session_username.set('')
		}
	}, 10)
}

export function jwtSession() {
	return { Authorization: 'Bearer ' + get(session_token) }
}

export function updateSessionToken(response: Response) {
	// TODO refactor this.  Client code should not be explicitly concerned
	// with extracting / updating access tokens.
	const fullAccessToken = response.headers.get('Authorization')
	if (fullAccessToken) {
		const accessToken = fullAccessToken.replace(/^Bearer /, '')
		session_token.update(() => accessToken)
	}
}
