// Hooks to run at app startup.

import type { Handle, RequestEvent } from '@sveltejs/kit'
import { dev } from '$app/environment'

// See https://kit.svelte.dev/docs/modules#$env-static-private
import {
	ADMIN_USERNAME,
	ADMIN_PASSWORD,
	USER_DB_PATH,
	JWT_ACCESS_SECRET,
	JWT_ACCESS_DURATION,
	SMTP_SERVER,
	SMTP_PORT,
	EMAIL_USERNAME,
	EMAIL_PASSWORD,
	SURRENDER_EMAIL_RECIPIENTS
} from '$env/static/private'

import * as tokens from '$lib/server/auth/tokens'
import * as userDB from '$lib/server/auth/user_db'
import * as emailer from '$lib/server/intake_emails/emailer'

// Verify that all required envs are defined
if (
	!(
		ADMIN_USERNAME &&
		ADMIN_PASSWORD &&
		JWT_ACCESS_SECRET &&
		JWT_ACCESS_DURATION &&
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
	accessMinutes: parseFloat(JWT_ACCESS_DURATION)
})

await userDB.configure({
	dbPath: USER_DB_PATH,
	adminUsername: ADMIN_USERNAME,
	adminPassword: ADMIN_PASSWORD
})

await emailer.configure({
	smtpServer: SMTP_SERVER,
	smtpPort: parseInt(SMTP_PORT),
	username: EMAIL_USERNAME,
	passwd: EMAIL_PASSWORD,
	formRecipients: SURRENDER_EMAIL_RECIPIENTS,
	verbose: true
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

function extractSessionInfo(event: RequestEvent) {
	// How should this stuff be done?
	// See https://github.com/sveltejs/realworld, src/hooks.server.js, and be more confused.

	// Get user from session token.
	const username = tokens.sessionUsernameFromToken(event.cookies.get('sess_tok'))
	if (username != null && userDB.isKnownUser(username)) {
		event.locals.username = username
	}
}

export const handle: Handle = async function ({ event, resolve }) {
	extractSessionInfo(event)

	let accessToken: string = ''
	const needsAuth = needsAuthentication(event.request)
	if (needsAuth) {
		if (event.locals.username === undefined) {
			return tokens.invalidTokenResponse()
		}
	}

	const response = await resolve(event)

	// If we still have a username for the session, add a session cookie.
	if (event.locals.username !== undefined) {
		tokens.addSessionTokenForUsername(response.headers, event.locals.username)
	}

	return response
}
