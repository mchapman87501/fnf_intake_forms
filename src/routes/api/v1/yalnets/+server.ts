import type { RequestEvent } from '@sveltejs/kit'
import {
	addAccessToken,
	addRefreshToken,
	newAccessToken,
	newRefreshToken
} from '$lib/auth/tokens.server'

import { authenticate } from '$lib/auth/user_db.server'

// To fix 405 error:
// https://stackoverflow.com/a/73755196
// +page.server.ts should export const actions.
// +server.ts (like this file) should still use
// function POST.

export async function POST(event: RequestEvent): Promise<Response> {
	let formParams: FormData = await event.request.formData()
	console.log('yalnets form params: %o', formParams)
	const username = formParams.get('username')?.toString() || ''
	const password = formParams.get('password')?.toString() || ''

	let refreshToken = await authenticate(username, password)
	if (!refreshToken) {
		let headers = new Headers()
		headers.set('WWW-Authenticate', 'Bearer')
		return new Response('Could not authenticate', { status: 401, headers: headers })
	}

	console.debug('Yalnets got refresh token: %o', refreshToken)

	const accessToken = newAccessToken(formParams['username'])
	let headers = new Headers()
	addAccessToken(headers, accessToken)
	addRefreshToken(headers, refreshToken)

	const body = JSON.stringify({ access_token: accessToken, token_type: 'bearer' })
	const resp = new Response(body, { status: 200, headers: headers })
	console.log('Yalnets: %o', resp)
	return resp
}
