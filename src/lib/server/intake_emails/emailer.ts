import path from 'path'
import * as nodemailer from 'nodemailer'

import type { ProcessedSurrenderInfo } from '$lib/server/api_support/processed_surrender_info'

export type Configuration = {
	smtpServer: string
	smtpPort: number
	username: string
	passwd: string
	formRecipients: string // comma-separated email addresses
	verbose?: boolean // default: false-y
}

let config: Configuration = {
	smtpServer: 'not configured',
	smtpPort: 0,
	username: 'not configured',
	passwd: 'not configured',
	formRecipients: '',
	verbose: false
}

let transporter: nodemailer.Transporter | null = null

async function validateRecipients(recipients: string): Promise<boolean> {
	const items = recipients.split(',')
	const hasAddresses = items.length > 0
	const addressesLookPlausible = items.every((addr) => {
		// This is just a basic sanity check, nothing so hairy as
		// https://www.abstractapi.com/guides/email-address-pattern-validation
		let match = addr.match(/.+@.+\..+/)
		if (match === null) {
			config.verbose && console.warn('This email address looks wonky: %o', addr)
		}
		return match != null
	})
	return hasAddresses && addressesLookPlausible
}

export async function reset() {
	transporter = null
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
		(await validateRecipients(newConfig.formRecipients)) && (await newTransporter.verify())

	if (result) {
		transporter = newTransporter
		config = newConfig
		config.verbose = newConfig.verbose || false
	} else {
		transporter = null
	}
	return result
}

function newMessage(info: ProcessedSurrenderInfo): nodemailer.SendMailOptions {
	const body = `Greetings!

A cat has been surrendered.  
Rescue ID: ${info.rescueID}
Cat's Name: ${info.catName}

Here is more info about the ${info.surrenderType} surrender.

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
		},
		{
			path: info.intakeSingleRowFormPath,
			filename: path.basename(info.intakeSingleRowFormPath)
		},
		// Should PDFs be optional?
		{
			path: info.surrenderPDFPath,
			filename: path.basename(info.surrenderPDFPath)
		}
	]
	if (info.photoPath !== undefined) {
		attachments.push({
			path: info.photoPath,
			filename: path.basename(info.photoPath)
		})
	}

	const result = {
		from: 'noreply@fnf_intake_service.org',
		to: config.formRecipients,
		subject: `${info.surrenderType} Surrender ${info.rescueID} - ${info.catName}`,
		text: body,
		attachments: attachments
	}
	return result
}

export function canSend(): boolean {
	return transporter !== null
}

export async function emailSurrenderInfo(info: ProcessedSurrenderInfo): Promise<boolean> {
	if (transporter == null) {
		return Promise.reject(new Error('Mail transporter is not configured.'))
	}

	const message = newMessage(info)
	await transporter.sendMail(message)
	return true
}

export function emailSurrenderInfoLater(info: ProcessedSurrenderInfo) {
	emailSurrenderInfo(info).catch((error) => {
		if (config.verbose) {
			console.error('Surrender form could not be emailed.')
			console.error('Error : %o', error.message)
			console.error('Surrender info: %o', info)
		}
	})
}
