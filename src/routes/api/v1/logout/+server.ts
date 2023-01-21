import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'
import { clearSessionToken } from '$lib/server/auth/tokens'

// To fix 405 error:
// https://stackoverflow.com/a/73755196
// +page.server.ts should export const actions.
// +server.ts (like this file) should still use
// function POST.

export async function POST(event: RequestEvent): Promise<Response> {
	event.locals.username = undefined

	let headers = new Headers()
	clearSessionToken(headers)

	return json('Successful logout', { headers: headers })
}
