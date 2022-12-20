import type { RequestEvent } from '@sveltejs/kit'
import { invalidTokenResponse, validAccessToken } from '$lib/hooks/tokens.server'
export const prerender = true

export function GET(event: RequestEvent): Response {
	if (!validAccessToken(event)) {
		return invalidTokenResponse()
	}
	return new Response('OK')
}
