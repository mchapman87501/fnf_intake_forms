import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'
import { addAccessToken, addRefreshToken, newAccessToken } from '$lib/server/auth/tokens'

import { authenticate } from '$lib/server/auth/user_db'

// To fix 405 error:
// https://stackoverflow.com/a/73755196
// +page.server.ts should export const actions.
// +server.ts (like this file) should still use
// function POST.

export async function POST(event: RequestEvent): Promise<Response> {
	let formParams: FormData = await event.request.formData()
	const username = formParams.get('username')?.toString() || ''
	const password = formParams.get('password')?.toString() || ''

	let refreshToken = await authenticate(username, password)
	if (!refreshToken) {
		let headers = new Headers()
		headers.set('WWW-Authenticate', 'Bearer')
		// TODO what to use for challenge data?
		return new Response('Could not authenticate', { status: 401, headers: headers })
	}

	const accessToken = newAccessToken(username)
	let headers = new Headers()
	addAccessToken(headers, accessToken)
	addRefreshToken(headers, refreshToken)

	return json({ access_token: accessToken, token_type: 'bearer' }, { headers: headers })
}
