import jwt from 'jsonwebtoken'
import cookie from 'cookie'

import { usernameForRefreshTokenSync } from './user_db.server'

export type TokensServerConfig = {
	isDevEnv: boolean
	accessSecret: string
	accessMinutes: number
	refreshSecret: string
	refreshMinutes: number
}

let config: TokensServerConfig = {
	isDevEnv: true,
	accessSecret: 'uninitialized',
	accessMinutes: 1,
	refreshSecret: 'uninitilialized',
	refreshMinutes: 240
}

export function configure(newValue: TokensServerConfig) {
	config = newValue
}

// Get a duration, in seconds, from an env value; defaulting to defaultVal
function duration(minutes: number, defaultVal: number): number {
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
	return newToken(username, config.accessSecret, duration(config.accessMinutes, 1))
}

export function newRefreshToken(username: string): string {
	// Let refresh tokens live for a half-day shift.
	const dfltMinutes = 60 * 4
	return newToken(username, config.refreshSecret, duration(config.refreshMinutes, dfltMinutes))
	// NB: The refreshToken needs to be stored in a transient "session" database.
	// See user_db.server.ts
}

function secureSetting(): string {
	// Development vs. production.
	// See https://kit.svelte.dev/docs/modules#$app-environment-dev
	return config.isDevEnv ? '' : ' Secure;'
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

function verifyToken(token: string, secret: string, title: string): any | null {
	try {
		return jwt.verify(token, secret)
	} catch (e) {
		// Missing, invalid or expired token
		console.error('Could not verify %o token: %o', title, e)
	}
	return null
}

// This should not be exported -- but I need to be able to test it.
export function verifyRefreshToken(token: string): any | null {
	return verifyToken(token, config.refreshSecret, 'refresh')
}

// This should not be exported -- but I need to be able to test it.
export function verifyAccessToken(token: string): any | null {
	return verifyToken(token, config.accessSecret, 'access')
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
	if (verifyRefreshToken(currRefreshToken)) {
		const username = usernameForRefreshTokenSync(currRefreshToken)
		if (username) {
			return newAccessToken(username)
		}
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
