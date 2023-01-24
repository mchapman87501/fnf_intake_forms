// Hooks to run at app startup.

import type { Handle, RequestEvent } from '@sveltejs/kit'
import { dev } from '$app/environment'
import { env } from '$env/dynamic/public'

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

import * as Tokens from '$lib/server/auth/tokens'
import * as Emailer from '$lib/server/intake_emails/emailer'
import * as AppDB from '$lib/server/db/app_db'

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

// WORKAROUND to enable testing with Safari, and with app running inside Docker
// from http://localhost/.
// Safari will not send Secure cookies to an http: endpoint -- not even http://localhost/.
await Tokens.configure({
	isDevEnv: dev || env.PUBLIC_SET_INSECURE_SESSION_COOKIE == 'true',
	accessSecret: JWT_ACCESS_SECRET,
	accessMinutes: parseFloat(JWT_ACCESS_DURATION)
})

await AppDB.configure({
	dbPath: USER_DB_PATH,
	adminUsername: ADMIN_USERNAME,
	adminPassword: ADMIN_PASSWORD
})

await Emailer.configure({
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
	const username = Tokens.sessionUsernameFromToken(event.cookies.get('sess_tok'))
	if (username != null && AppDB.shared?.user.isKnownUser(username)) {
		event.locals.username = username
	}
}

export const handle: Handle = async function ({ event, resolve }) {
	extractSessionInfo(event)

	const needsAuth = needsAuthentication(event.request)
	if (needsAuth) {
		if (event.locals.username === undefined) {
			return Tokens.invalidTokenResponse()
		}
	}

	const response = await resolve(event)

	// If we still have a username for the session, add a session cookie.
	if (event.locals.username !== undefined) {
		Tokens.addSessionTokenForUsername(response.headers, event.locals.username)
	}

	return response
}
