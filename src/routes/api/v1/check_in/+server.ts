import type { RequestEvent } from '@sveltejs/kit'
import { invalidTokenResponse } from '$lib/server/auth/tokens'

export function GET(event: RequestEvent): Response {
	// If this session has no user (see hooks.server.ts), indicate as much.
	if (event.locals.username === undefined) {
		return invalidTokenResponse()
	}
	return new Response('OK')
}
