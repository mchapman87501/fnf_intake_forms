import { beforeEach, afterEach, describe, expect, test } from 'vitest'

import fsPromises from 'fs/promises'
import * as path from 'path'
import { temporaryDirectoryTask } from 'tempy'

import { testSmtpServer } from 'test-smtp-server'

import * as emailer from './emailer'

let mockSMTP = new testSmtpServer({ smtpPort: 5025 })

describe('Test emailer basics', async () => {
	async function delay(msec: number = 200): Promise<string> {
		return new Promise((resolve, _) => {
			setTimeout(() => {
				resolve('Timeout elapsed')
			}, msec)
		})
	}

	beforeEach(async () => {
		mockSMTP.startServer()
	})

	afterEach(async () => {
		// test-smtp-server seems not to wait until its underlying server --
		// a nodemailer smtp-server has finished closing.
		mockSMTP.stopServer()
		await delay()

		mockSMTP.clearEmails()
		await emailer.reset()
	})

	test('Detect missing recipient list', async () => {
		const configured = await emailer.configure({
			smtpServer: 'no_such_server@host.org',
			smtpPort: 465,
			username: 'bob@host.org',
			passwd: 'Bobs password',
			formRecipients: '',
			verbose: true
		})
		expect(configured).toBe(false)

		expect(emailer.canSend()).toBe(false)
	})

	test('Report uninitialized config', async () => {
		const sendMsg = () => {
			return emailer.emailSurrenderInfo({
				rescueID: '<surrender ID>',
				catName: 'Cat Hear Me Roar',
				surrenderType: 'Stray',
				surrenderFormPath: 'noSuchSurrender.csv',
				intakeFormPath: 'noSuchIntake.csv',
				intakeSingleRowFormPath: 'noSuchWideIntake.csv',
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
			formRecipients: 'abc@def.com',
			verbose: true
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
			formRecipients: 'bob@other_host.org,cat_person@spca.org',
			verbose: true
		}
		const configured = await emailer.configure(config)
		expect(configured).toBe(true)
		expect(emailer.canSend()).toBe(true)

		const didSend = emailer.emailSurrenderInfo({
			rescueID: '<rescueID>',
			catName: 'Attachment Issues',
			surrenderType: 'Owner',
			surrenderFormPath: 'noSuchSurrender.csv',
			intakeFormPath: 'noSuchIntake.csv',
			intakeSingleRowFormPath: 'noSuchWideIntake.csv',
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
			formRecipients: 'bob@other_host.org,cat_person@spca.org',
			verbose: true
		}
		const configured = await emailer.configure(config)
		expect(configured).toBe(true)

		await temporaryDirectoryTask(async (tempdir) => {
			const surrPath = path.join(tempdir, 'surrender.csv')
			const intakePath = path.join(tempdir, 'intake.csv')
			const intakeWidePath = path.join(tempdir, 'intake-single-row.csv')
			await fsPromises.writeFile(surrPath, '')
			await fsPromises.writeFile(intakePath, '')
			await fsPromises.writeFile(intakeWidePath, '')

			const didSend = await emailer.emailSurrenderInfo({
				rescueID: 'fake_surrender_id',
				catName: 'Fido',
				surrenderType: 'Stray',
				surrenderFormPath: surrPath,
				intakeFormPath: intakePath,
				intakeSingleRowFormPath: intakeWidePath,
				photoPath: null
			})
			expect(didSend).toBe(true)
			const emails = mockSMTP.getEmails()
			expect(emails.length).toBe(1)
			// Worry not about the content.
			// console.debug('Emails: %o', emails)
		})
	})

	// TODO test with some valid, some invalid, formRecipient addresses.

	test('Send later without first configuring', async () => {
		expect(emailer.canSend()).toBe(false)
		emailer.emailSurrenderInfoLater({
			rescueID: '<surrender ID>',
			catName: 'Unnamed Stray',
			surrenderType: 'Stray',
			surrenderFormPath: 'noSuchSurrender.csv',
			intakeFormPath: 'noSuchIntake.csv',
			intakeSingleRowFormPath: 'noSuchWideIntake.csv',
			photoPath: 'noSuchPhoto.jpg'
		})
		// The whole point of email...Later is to fire and
		// forget.  So there isn't much to test, except to
		// verify that the call doesn't throw when, e.g.,
		// the mailer is not configured.
		//
		// Still, wait a bit, in hopes that the console output will
		// show something interesting.
		// TODO use vitest-console to capture and check console output.
		await delay()
	})

	test('Send later with missing attachment files.', async () => {
		const config: emailer.Configuration = {
			smtpServer: 'localhost',
			smtpPort: mockSMTP.getPort(),
			username: 'bob@host.org',
			passwd: 'Bobs password',
			formRecipients: 'bob@other_host.org,cat_person@spca.org',
			verbose: true
		}
		const configured = await emailer.configure(config)
		expect(configured).toBe(true)
		expect(emailer.canSend()).toBe(true)

		const surrenderInfo = {
			rescueID: '<rescueID>',
			catName: '<catName>',
			surrenderType: 'Owner',
			surrenderFormPath: 'noSuchSurrender.csv',
			intakeFormPath: 'noSuchIntake.csv',
			intakeSingleRowFormPath: 'noSuchWideIntake.csv',
			photoPath: null
		}

		emailer.emailSurrenderInfoLater(surrenderInfo)
		await delay()
	})

	test('Email subject has both rescueID and cat name', async () => {
		const config: emailer.Configuration = {
			smtpServer: 'localhost',
			smtpPort: mockSMTP.getPort(),
			username: 'bob@host.org',
			passwd: 'Bobs password',
			formRecipients: 'bob@other_host.org,cat_person@spca.org',
			verbose: true
		}
		const configured = await emailer.configure(config)
		expect(configured).toBe(true)
		expect(emailer.canSend()).toBe(true)

		await temporaryDirectoryTask(async (tempdir) => {
			const createTmpF = async (filename: string) => {
				const result = path.join(tempdir, filename)
				await fsPromises.writeFile(result, '')
				return result
			}

			const rescueID = '<rescue_id>'
			const catName = '<cat_name>'
			const surrenderInfo = {
				rescueID: rescueID,
				catName: catName,
				surrenderType: 'Owner',
				surrenderFormPath: await createTmpF('surrender.csv'),
				intakeFormPath: await createTmpF('intake.csv'),
				intakeSingleRowFormPath: await createTmpF('intake-single-row.csv'),
				photoPath: null
			}

			await emailer.emailSurrenderInfo(surrenderInfo)
			const emails = mockSMTP.getEmails()
			expect(emails.length).toBe(1)
			const parsed = await emails[0].getParsed()
			const subjectHasRescueID = (parsed.subject || '').indexOf(rescueID) >= 0
			const subjectHasCatName = (parsed.subject || '').indexOf(catName) >= 0
			expect(subjectHasRescueID && subjectHasCatName).toBe(true)
		})
	})
})
