// Hooks to run at app startup.

import type { Handle } from '@sveltejs/kit'
import { dev } from '$app/environment'

// See https://kit.svelte.dev/docs/modules#$env-static-private
import {
	ADMIN_USERNAME,
	ADMIN_PASSWORD,
	USER_DB_PATH,
	JWT_ACCESS_SECRET,
	JWT_ACCESS_DURATION,
	JWT_REFRESH_SECRET,
	JWT_REFRESH_DURATION,
	SMTP_SERVER,
	SMTP_PORT,
	EMAIL_USERNAME,
	EMAIL_PASSWORD,
	SURRENDER_EMAIL_RECIPIENTS
} from '$env/static/private'

import * as tokens from '$lib/auth/tokens.server'
import * as userDB from '$lib/auth/user_db.server'
import * as emailer from '$lib/intake_emails/emailer.server'

// Verify that all required envs are defined
if (
	!(
		ADMIN_USERNAME &&
		ADMIN_PASSWORD &&
		JWT_ACCESS_SECRET &&
		JWT_ACCESS_DURATION &&
		JWT_REFRESH_SECRET &&
		JWT_REFRESH_DURATION &&
		USER_DB_PATH &&
		SMTP_SERVER &&
		EMAIL_USERNAME &&
		EMAIL_PASSWORD &&
		SURRENDER_EMAIL_RECIPIENTS
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

tokens.configure({
	isDevEnv: dev,
	accessSecret: JWT_ACCESS_SECRET,
	accessMinutes: parseFloat(JWT_ACCESS_DURATION),
	refreshSecret: JWT_REFRESH_SECRET,
	refreshMinutes: parseFloat(JWT_REFRESH_DURATION),
	usernameForRefreshToken: userDB.usernameForRefreshTokenSync
})

await userDB.initUserDB(USER_DB_PATH, ADMIN_USERNAME, ADMIN_PASSWORD)

await emailer.configure({
	smtpServer: SMTP_SERVER,
	smtpPort: parseInt(SMTP_PORT),
	username: EMAIL_USERNAME,
	passwd: EMAIL_PASSWORD,
	formRecipients: SURRENDER_EMAIL_RECIPIENTS
})

// Some API endpoints can be accessed only by authenticated (and, someday, authorized) clients.
const authenticatedEndPoints = new Set([
	'owner_surrender_form',
	'rescue_surrender_form',
	'stray_surrender_form',
	'download'
])

function needsAuthentication(request: Request): boolean {
	const apiRoute = /\/api\/v1\/([^/]+)/
	const url = request.url
	const match = url.match(apiRoute)
	if (match !== null) {
		const tail = match[match.length - 1]
		return authenticatedEndPoints.has(tail)
	}
	return false
}

export const handle: Handle = async function ({ event, resolve }) {
	let accessToken: string = ''
	const needsAuth = needsAuthentication(event.request)
	if (needsAuth) {
		accessToken = tokens.renewedAccessToken(event.request)
		if (!accessToken) {
			console.debug('hooks.server.ts\\handle: Could not renew the access token.')
			return tokens.invalidTokenResponse()
		}
	}

	const response = await resolve(event)

	if (needsAuth) {
		const refreshToken = tokens.extractedRefreshToken(event.request)
		tokens.addAccessToken(response.headers, accessToken)
		tokens.addRefreshToken(response.headers, refreshToken)
	}

	return response
}
