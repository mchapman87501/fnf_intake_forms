import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import cookie from 'cookie'

// See https://www.okupter.com/blog/environment-variables-in-sveltekit
import { JWT_ACCESS_TOKEN_SECRET, JWT_ACCESS_TOKEN_DURATION } from '$env/static/private'
import { usernameForRefreshTokenSync } from './user_db.server'

export function newAccessToken(username: string) {
	const payload = {
		username: username
	}

	const durationMinutes = parseInt(JWT_ACCESS_TOKEN_DURATION)
	const durationSecs = durationMinutes * 60
	return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: `${durationSecs}s` })
}

export function newRefreshToken() {
	// Trying to follow https://dev.to/pilcrowonpaper/sveltekit-jwt-authentication-tutorial-2m34
	// The refreshToken needs to be stored in a transient "session" database.
	const result = randomUUID()
	return result
}

function secureSetting(): string {
	return '' // dev mode.  Use ' Secure;' for production.
}

export function addAccessToken(headers: Headers, accessToken: string) {
	headers.set('Authorization', 'Bearer ' + accessToken)
}

export function addRefreshToken(headers: Headers, refreshToken: string) {
	const secure = secureSetting()
	const maxDays = 30
	const maxSeconds = maxDays * 24 * 60 * 60
	const refreshCookie = `refresh_token=${refreshToken}; Max-Age=${maxSeconds}; Path=/; ${secure} HttpOnly`
	headers.set('set-cookie', refreshCookie)
}

export function extractedAccessToken(request: Request): string {
	const fullAuthValue = request.headers.get('Authorization') || ''
	const result = fullAuthValue.replace(/^Bearer /, '')
	return result
}

export function extractedRefreshToken(request: Request): string {
	const rawCookies = request.headers.get('cookie') || ''
	const cookies = cookie.parse(rawCookies)
	return cookies['refresh_token'] || ''
}

function verifyAccessToken(token: string): any | null {
	try {
		return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET)
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
