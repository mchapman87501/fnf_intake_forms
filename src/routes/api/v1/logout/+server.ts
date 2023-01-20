import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'
import { addAccessToken, addRefreshToken } from '$lib/server/auth/tokens'

// To fix 405 error:
// https://stackoverflow.com/a/73755196
// +page.server.ts should export const actions.
// +server.ts (like this file) should still use
// function POST.

export async function POST(_: RequestEvent): Promise<Response> {
	// What prevents a malicious client from continuing to use an invalidated
	// access token?
	const refreshToken = '' // Invalid
	const accessToken = '' // Invalid

	let headers = new Headers()
	addAccessToken(headers, accessToken)
	addRefreshToken(headers, refreshToken)

	return json({ access_token: accessToken, token_type: 'bearer' }, { headers: headers })
}
