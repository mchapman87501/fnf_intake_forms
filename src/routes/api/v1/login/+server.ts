import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'

import { auth } from '$lib/server/auth/user_db'

// To fix 405 error:
// https://stackoverflow.com/a/73755196
// +page.server.ts should export const actions.
// +server.ts (like this file) should still use
// function POST.

export async function POST(event: RequestEvent): Promise<Response> {
	let formParams: FormData = await event.request.formData()
	const username = formParams.get('username')?.toString() || ''
	const password = formParams.get('password')?.toString() || ''

	try {
		if (await auth(username, password)) {
			// Record the authenticated user, so that hooks.server.ts\handle knows
			// to add a session cookie to the response.
			event.locals.username = username
			return json('Successful login')
		}
	} catch (e) {
		console.error(`Login error: ${e}`)
	}
	return new Response('Could not authenticate', { status: 401 })
}
