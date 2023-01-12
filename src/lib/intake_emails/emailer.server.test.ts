import { beforeEach, afterEach, describe, expect, test } from 'vitest'

import fsPromises from 'fs/promises'
import * as path from 'path'
import { temporaryDirectoryTask } from 'tempy'

import { testSmtpServer } from 'test-smtp-server'

import * as emailer from './emailer.server'

let mockSMTP = new testSmtpServer({
	/* debug: console.log, localhostOnly: true */
})

describe('Test emailer basics', async () => {
	beforeEach(async () => {
		await mockSMTP.startServer()
	})

	afterEach(async () => {
		mockSMTP.stopServer()
		mockSMTP.clearEmails()
	})

	test('Detect missing recipient list', async () => {
		const configured = await emailer.configure({
			smtpServer: 'no_such_server@host.org',
			smtpPort: 465,
			username: 'bob@host.org',
			passwd: 'Bobs password',
			formRecipients: ''
		})
		expect(configured).toBe(false)

		expect(emailer.canSend()).toBe(false)
	})

	test('Report uninitialized config', async () => {
		const sendMsg = () => {
			return emailer.emailSurrenderInfo({
				surrenderID: '<surrender ID>',
				surrenderType: 'Stray',
				surrenderFormPath: 'noSuchSurrender.csv',
				intakeFormPath: 'noSuchIntake.csv',
				photoPath: 'noSuchPhoto.jpg'
			})
		}
		expect(emailer.canSend()).toBe(false)
		await expect(sendMsg()).rejects.toThrow(/is not configured/)
	})

	test('Report invalid config', async () => {
		const promise = emailer.configure({
			smtpServer: 'no_such_server@host.org',
			smtpPort: 465,
			username: 'bob@host.org',
			passwd: 'Bobs password',
			formRecipients: 'abc@def.com'
		})
		// Should throw some sort of host lookup failure.
		// I'm not sure how the error message might vary by platform,
		// hence this.
		await expect(promise).rejects.toThrow()
		expect(emailer.canSend()).toBe(false)
	})

	test('Handle invalid attachment files', async () => {
		const config: emailer.Configuration = {
			smtpServer: 'localhost',
			smtpPort: mockSMTP.getPort(),
			username: 'bob@host.org',
			passwd: 'Bobs password',
			formRecipients: 'bob@other_host.org,cat_person@spca.org'
		}
		const configured = await emailer.configure(config)
		expect(configured).toBe(true)
		expect(emailer.canSend()).toBe(true)

		const didSend = emailer.emailSurrenderInfo({
			surrenderID: '<surrenderID>',
			surrenderType: 'Owner',
			surrenderFormPath: 'noSuchSurrender.csv',
			intakeFormPath: 'noSuchIntake.csv',
			photoPath: null
		})

		await expect(didSend).rejects.toThrow(/no such file/)
	})

	test('Send when inputs are valid', async () => {
		const config: emailer.Configuration = {
			smtpServer: 'localhost',
			smtpPort: mockSMTP.getPort(),
			username: 'bob@host.org',
			passwd: 'Bobs password',
			formRecipients: 'bob@other_host.org,cat_person@spca.org'
		}
		const configured = await emailer.configure(config)
		expect(configured).toBe(true)

		await temporaryDirectoryTask(async (tempdir) => {
			const surrPath = path.join(tempdir, 'surrender.csv')
			const intakePath = path.join(tempdir, 'intake.csv')
			await fsPromises.writeFile(surrPath, '')
			await fsPromises.writeFile(intakePath, '')

			const didSend = await emailer.emailSurrenderInfo({
				surrenderID: 'fake_surrender_id',
				surrenderType: 'Stray',
				surrenderFormPath: surrPath,
				intakeFormPath: intakePath,
				photoPath: null
			})
			expect(didSend).toBe(true)
			const emails = mockSMTP.getEmails()
			expect(emails.length).toBe(1)
			// Worry not about the content.
			// console.debug('Emails: %o', emails)
		})
	})
})
