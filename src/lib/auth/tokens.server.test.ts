import { beforeEach, describe, expect, it } from 'vitest'
import cookie from 'cookie'

import * as tokens from '$lib/auth/tokens.server'

describe('Test token basics', async () => {
	const defaultConfig = {
		isDevEnv: true,
		accessSecret: 'TESTING(access)',
		accessMinutes: 1,
		refreshSecret: 'TESTING(refresh)',
		refreshMinutes: 1
	}

	const defaultProdConfig = { ...defaultConfig, ...{ isDevEnv: false } }

	beforeEach(() => {
		tokens.configure(defaultConfig)
	})

	it('Create a new access token', () => {
		const username = 'Access Token User'
		const accessToken = tokens.newAccessToken(username)
		expect(accessToken).not.toBeNull()
		const payload = tokens.verifyAccessToken(accessToken)
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

	it('Ignores non-numeric durations', () => {
		// Override default config.
		tokens.configure({
			isDevEnv: true,
			accessSecret: 'TESTING(access)',
			accessMinutes: parseInt('I am not a number'),
			refreshSecret: 'TESTING(refresh)',
			refreshMinutes: 1
		})
		const username = 'non-numeric duration user'
		const token = tokens.newAccessToken(username)

		// Duration should have units of seconds.
		const payload = tokens.verifyAccessToken(token)
		const duration = payload.exp - payload.iat
		expect(duration).toBe(60)
	})

	function checkAddRefreshToken(expectSecure: boolean) {
		let headers = new Headers()

		const username = 'refresher'
		const accessToken = tokens.newAccessToken(username)
		tokens.addRefreshToken(headers, accessToken)

		let numHeaders = 0
		let numRefreshCookies = 0
		let isSecure = false
		headers.forEach((value, key) => {
			numHeaders += 1
			if (key.toLowerCase() == 'set-cookie') {
				if (value.startsWith('refresh_token')) {
					numRefreshCookies += 1
				}

				isSecure ||= value.toLowerCase().match(/;\s*secure\s*;/) != null
			}
		})

		expect(numHeaders).toBe(1)
		expect(numRefreshCookies).toBe(1)
		expect(isSecure).toBe(expectSecure)
	}

	it('addRefreshToken adds token to headers - insecure', () => {
		// Default config is insecure:
		checkAddRefreshToken(false)
	})

	it('addRefreshToken adds token to headers - secure', () => {
		tokens.configure(defaultProdConfig)
		checkAddRefreshToken(true)
	})

	it('invalidTokenResponse clears refresh token', () => {
		const response = tokens.invalidTokenResponse()
		let foundClearedRefreshCookie = false
		response.headers.forEach((value, key) => {
			if (key.toLowerCase() == 'set-cookie') {
				foundClearedRefreshCookie ||= value.startsWith('refresh_token=;')
			}
		})
		expect(foundClearedRefreshCookie).toBe(true)
	})

	// TODO test addAccessToken, extractedAccessToken, extractedRefreshToken, validAccessToken,
	// renewedAccessToken.
})
