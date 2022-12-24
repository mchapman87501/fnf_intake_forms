import jwt from 'jsonwebtoken'
import cookie from 'cookie'

// See https://kit.svelte.dev/docs/modules#$env-static-private
import {
	JWT_ACCESS_SECRET,
	JWT_ACCESS_DURATION,
	JWT_REFRESH_SECRET,
	JWT_REFRESH_DURATION
} from '$env/static/private'
import { dev } from '$app/environment'

import { usernameForRefreshTokenSync } from './user_db.server'

// Get a duration, in seconds, from an env value; defaulting to defaultVal
function duration(envValue: string, defaultVal: number): number {
	let minutes = parseInt(envValue)
	if (isNaN(minutes)) {
		minutes = defaultVal
	}
	return minutes * 60
}

function newToken(username: string, secret: string, durationSecs: number): string {
	const payload = {
		username: username
	}
	return jwt.sign(payload, secret, { expiresIn: `${durationSecs}s` })
}

export function newAccessToken(username: string): string {
	return newToken(username, JWT_ACCESS_SECRET, duration(JWT_ACCESS_DURATION, 1))
}

export function newRefreshToken(username: string): string {
	// Let refresh tokens live for a half-day shift.
	const dfltMinutes = 60 * 4
	return newToken(username, JWT_REFRESH_SECRET, duration(JWT_REFRESH_DURATION, dfltMinutes))
	// NB: The refreshToken needs to be stored in a transient "session" database.
	// See user_db.server.ts
}

function secureSetting(): string {
	// Development vs. production.
	// See https://kit.svelte.dev/docs/modules#$app-environment-dev
	return dev ? '' : ' Secure;'
}

export function addAccessToken(headers: Headers, accessToken: string) {
	headers.set('Authorization', 'Bearer ' + accessToken)
}

export function addRefreshToken(headers: Headers, refreshToken: string) {
	const secure = secureSetting()
	const maxSeconds = 30 * 24 * 60 * 60 // Cookie lifetime : days * hrs/day * minutes/hr * seconds/minute

	// TODO Allow restricting the cookie's PATH to /api/v<whatever>.
	const refreshCookie = `refresh_token=${refreshToken}; Max-Age=${maxSeconds}; Path=/; ${secure} HttpOnly`
	// Set the cookie even when the refreshToken is blank/invalid, to help clear
	// refresh tokens from well-behaved clients.
	headers.set('set-cookie', refreshCookie)
}

export function extractedAccessToken(request: Request): string {
	const fullAuthValue = request.headers.get('Authorization') || ''
	return fullAuthValue.replace(/^Bearer /, '')
}

export function extractedRefreshToken(request: Request): string {
	const rawCookies = request.headers.get('cookie') || ''
	const cookies = cookie.parse(rawCookies)
	return cookies['refresh_token'] || ''
}

function verifyAccessToken(token: string): any | null {
	try {
		return jwt.verify(token, JWT_ACCESS_SECRET)
	} catch (e) {
		// Missing, invalid or expired token
		console.error('Could not verify access token: %o', e)
	}
	return null
}

export function validAccessToken(request: Request): boolean {
	return verifyAccessToken(extractedAccessToken(request)) != null
}

// Get a new access token, if a valid refresh token is supplied.
export function renewedAccessToken(request: Request): string {
	const currAccessToken = extractedAccessToken(request)
	if (verifyAccessToken(currAccessToken)) {
		return currAccessToken
	}
	const currRefreshToken = extractedRefreshToken(request)
	const username = usernameForRefreshTokenSync(currRefreshToken)
	if (username) {
		return newAccessToken(username)
	}
	return ''
}

export function invalidTokenResponse() {
	const secure = ''
	const headers = new Headers([
		['set-cookie', `refresh_token=; Max-Age=0; Path=/;${secure} HttpOnly`]
	])
	return new Response(null, { status: 401, headers: headers })
}
