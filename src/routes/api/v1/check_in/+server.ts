import type { RequestEvent } from '@sveltejs/kit'
import { invalidTokenResponse, validAccessToken } from '$lib/server/auth/tokens'

export function GET(event: RequestEvent): Response {
	if (!validAccessToken(event.request)) {
		return invalidTokenResponse()
	}
	return new Response('OK')
}
