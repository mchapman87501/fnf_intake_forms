import { beforeEach, describe, expect, it } from 'vitest'
import * as tokens from '$lib/server/auth/tokens.server'

describe('Test token basics', async () => {
	beforeEach(() => {
		tokens.configure({
			isDevEnv: false,
			accessSecret: 'TESTING(access)',
			accessMinutes: 1,
			refreshSecret: 'TESTING(refresh)',
			refreshMinutes: 1
		})
	})

	it('Create a new access token', () => {
		const username = 'Access Token User'
		const accessToken = tokens.newAccessToken(username)
		expect(accessToken).not.toBeNull()
		const payload = tokens.verifyAccessToken(accessToken)
		console.debug('PAYLOAD:', payload)
		expect(payload).not.toBeNull()
		expect(payload.username).toBe(username)
	})

	it('Create a new refresh token', () => {
		const username = 'Refresh token username'
		const refreshToken = tokens.newRefreshToken(username)
		expect(refreshToken).not.toBeNull()
		const payload = tokens.verifyRefreshToken(refreshToken)
		expect(payload).not.toBeNull()
		expect(payload.username).toBe(username)
	})

	it('Weakly check the use of secrets', () => {
		const username = 'seekrit you sr'
		const accessToken = tokens.newAccessToken(username)
		const refreshToken = tokens.newRefreshToken(username)

		expect(tokens.verifyAccessToken(accessToken)).not.toBeNull()
		expect(tokens.verifyRefreshToken(accessToken)).toBeNull()
		expect(tokens.verifyAccessToken(refreshToken)).toBeNull()
		expect(tokens.verifyRefreshToken(refreshToken)).not.toBeNull()
	})
})
