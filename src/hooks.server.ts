// Hooks to run at app startup.

import type { Handle } from '@sveltejs/kit'

import {
	ADMIN_USERNAME,
	ADMIN_PASSWORD,
	JWT_ACCESS_TOKEN_SECRET,
	JWT_ACCESS_TOKEN_DURATION,
	USER_DB_PATH
} from '$env/static/private'

import {
	invalidTokenResponse,
	renewedAccessToken,
	addAccessToken,
	addRefreshToken,
	extractedRefreshToken
} from '$lib/auth/tokens.server'

import { initUserDB } from '$lib/auth/user_db.server'

// Verify that all required envs are defined
if (
	!(
		ADMIN_USERNAME &&
		ADMIN_PASSWORD &&
		JWT_ACCESS_TOKEN_SECRET &&
		JWT_ACCESS_TOKEN_DURATION &&
		USER_DB_PATH
	)
) {
	const msg = `
------------------------------------------------------------------------
Some required environment variables are not defined.

See env_template.in for the environment variables that need to be
defined in, e.g., your .env file.
------------------------------------------------------------------------
    `
	console.error()
	throw new Error(msg)
}

// All required env vars are defined.  It's safe to initialize the user DB.
await initUserDB()

// Some API endpoints can be accessed only by authenticated (and, someday, authorized) clients.
const authenticatedEndPoints = ['owner_surrender_form', 'download']

function needsAuthentication(request: Request): boolean {
	const apiRoute = /\/api\/v1\/([^/]+)/
	const url = request.url
	const match = url.match(apiRoute)
	if (match !== null) {
		const tail = match[match.length - 1]
		return authenticatedEndPoints.findIndex((endpoint) => tail.startsWith(endpoint)) >= 0
	}
	return false
}

export const handle: Handle = async function ({ event, resolve }) {
	let accessToken: string = ''
	const needsAuth = needsAuthentication(event.request)
	if (needsAuth) {
		accessToken = renewedAccessToken(event.request)
		if (!accessToken) {
			console.debug('hooks.server.ts\\handle: Could not renew the access token.')
			return invalidTokenResponse()
		}
	}

	const response = await resolve(event)

	if (needsAuth) {
		const refreshToken = extractedRefreshToken(event.request)
		addAccessToken(response.headers, accessToken)
		addRefreshToken(response.headers, refreshToken)
	}

	return response
}
