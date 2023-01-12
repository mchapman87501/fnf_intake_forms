import path from 'path'
import * as nodemailer from 'nodemailer'

export type Configuration = {
	smtpServer: string
	smtpPort: number
	username: string
	passwd: string
	formRecipients: string // comma-separated email addresses
}

let config: Configuration = {
	smtpServer: 'not configured',
	smtpPort: 0,
	username: 'not configured',
	passwd: 'not configured',
	formRecipients: ''
}

let transporter: nodemailer.Transporter | null = null

async function verify(newTransporter: nodemailer.Transporter): Promise<boolean> {
	return new Promise((resolve, reject) => {
		newTransporter.verify((error, success) => {
			if (error) {
				reject(error)
			}
			resolve(success)
		})
	})
}

async function validateRecipients(recipients: string): Promise<boolean> {
	const items = recipients.split(',')
	const hasAddresses = items.length > 0
	const addressesLookPlausible = items.every((addr) => {
		// This is just a basic sanity check, nothing so hairy as
		// https://www.abstractapi.com/guides/email-address-pattern-validation
		let match = addr.match(/.+@.+\..+/)
		if (match === null) {
			console.warn('This email address looks wonky: %o', addr)
		}
		return match != null
	})
	return hasAddresses && addressesLookPlausible
}

export async function configure(newConfig: Configuration): Promise<Boolean> {
	let newTransporter = nodemailer.createTransport({
		host: newConfig.smtpServer,
		port: newConfig.smtpPort,
		secure: true,
		tls: {
			rejectUnauthorized: false
		},
		auth: {
			user: newConfig.username,
			pass: newConfig.passwd
		}
	})

	const result =
		(await validateRecipients(newConfig.formRecipients)) && (await verify(newTransporter))

	if (result) {
		transporter = newTransporter
		config = newConfig
	} else {
		transporter = null
	}
	return result
}

export type SurrenderInfo = {
	surrenderID: string
	surrenderType: string // E.g., "Rescue" or "Stray"
	surrenderFormPath: string // Pathname of the CSV surrender form -- an owner-surrender, stray, rescue, etc., CSV
	intakeFormPath: string // Pathname of the intake form
	photoPath: string | null // Optional pathname of a photo of the cat.
}

function newMessage(info: SurrenderInfo): nodemailer.SendMailOptions {
	const body = `Greetings!

A cat has been surrendered.  Here is info about the ${info.surrenderType} surrender.

--
Felines & Friends Intake Service
`

	let attachments = [
		{
			path: info.surrenderFormPath,
			filename: path.basename(info.surrenderFormPath)
		},
		{
			path: info.intakeFormPath,
			filename: path.basename(info.intakeFormPath)
		}
	]
	if (info.photoPath != null) {
		attachments.push({
			path: info.photoPath,
			filename: path.basename(info.photoPath)
		})
	}

	const result = {
		from: 'noreply@fnf_intake_service.org',
		to: config.formRecipients,
		subject: `${info.surrenderType} Surrender ${info.surrenderID}`,
		text: body,
		attachments: attachments
	}
	return result
}

export function canSend(): boolean {
	return transporter !== null
}

export async function emailSurrenderInfo(info: SurrenderInfo): Promise<boolean> {
	if (transporter == null) {
		return Promise.reject(new Error('Mail transporter is not configured.'))
	}

	const message = newMessage(info)
	await transporter.sendMail(message)
	return true
}
