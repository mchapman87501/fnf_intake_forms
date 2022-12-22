import type { RequestEvent } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'
import { createObjectCsvWriter } from 'csv-writer'
import path from 'path'
import fsPromises from 'fs/promises'

import {
	invalidTokenResponse,
	renewedAccessToken,
	addAccessToken,
	addRefreshToken,
	extractedRefreshToken
} from '$lib/auth/tokens.server'

const dataDir = path.join(process.cwd(), 'data', 'out')

type CatPkg = any
type ReceivedFromPkg = any

function getRows(catInfo: CatPkg, recvdFrom: ReceivedFromPkg) {
	return [
		{ name: 'Intake Date', value: catInfo.intakeDate, comments: '' },
		{ name: 'Received By', value: catInfo.intakeFnFRepr, comments: '' },
		{ name: 'Received From', value: recvdFrom.fromName, comments: '' },
		{ name: 'Street Address', value: recvdFrom.address, comments: '' },
		{ name: 'City', value: recvdFrom.city, comments: '' },
		{ name: 'State', value: recvdFrom.state, comments: '' },
		{ name: 'Zip code', value: recvdFrom.zip, comments: '' },
		{ name: 'Cell/Home phone', value: recvdFrom.phone, comments: '' },
		{ name: 'Email Address', value: recvdFrom.email, comments: '' },
		{ name: 'Reason for surrender', value: catInfo.intakeReason, comments: '' },
		{ name: 'Shelter Number', value: recvdFrom.shelterNum, comments: '' },
		{ name: "Cat's name", value: catInfo.catName, comments: '' },
		{ name: 'DOB', value: catInfo.DOB, comments: '' },
		{ name: 'Gender', value: catInfo.gender, comments: '' }
	]
}

function getCSVPathname(catInfo: CatPkg, receivedFrom: ReceivedFromPkg): string {
	const catName: string = catInfo.catName
	const intakeDate: string = catInfo.intakeDate // TODO verify MMDDYY
	const humanName: string = receivedFrom.fromName
	const rawStem = `${catName}-${humanName}-${intakeDate}`
	// Needed: filename sanitization rules.
	const validStemChars = Array.from(rawStem).flatMap((c) => {
		if (c.match(/(\w|-)/)) {
			return c
		} else if (c.match(/\s/)) {
			return '_'
		} else {
			return ''
		}
	})
	const csvFilename = validStemChars.join('').replaceAll(/[_-][_-]+/g, '_') + '.csv'

	return path.join(dataDir, csvFilename)
}

async function saveIntakeForm(catInfo: CatPkg, receivedFrom: ReceivedFromPkg): Promise<string> {
	// Generate a filename:
	const csvPathname = getCSVPathname(catInfo, receivedFrom)
	try {
		await fsPromises.mkdir(dataDir, { recursive: true })

		const csvHeaders = [
			{ id: 'name', title: '' },
			{ id: 'value', title: 'INFO' },
			{ id: 'comments', title: 'COMMENTS' }
		]
		const records = getRows(catInfo, receivedFrom)

		const fileWriter = createObjectCsvWriter({
			path: csvPathname,
			header: csvHeaders
		})
		await fileWriter.writeRecords(records)

		const result = await fsPromises.readFile(csvPathname, { encoding: 'utf-8' })
		return JSON.stringify(result)
	} catch (e: any) {
		console.error(e.message)
		return Promise.reject(e.message)
	}
}

export async function POST(event: RequestEvent): Promise<Response> {
	const refreshToken = extractedRefreshToken(event.request)
	const accessToken = renewedAccessToken(event.request)
	if (!accessToken) {
		return invalidTokenResponse()
	}

	const formParams: { [index: string]: any } = await event.request.json()

	const catInfo = formParams['cat_info']
	const receivedFrom = formParams['received_from']

	try {
		const body = await saveIntakeForm(catInfo, receivedFrom)

		// TODO Refactor as middleware, 'cuz this is nuts.
		let headers = new Headers()
		addAccessToken(headers, accessToken)
		addRefreshToken(headers, refreshToken)

		return new Response(body, { status: 200, headers: headers })
	} catch (e: any) {
		console.error(e.message)
		return json('Failed to save intake record')
	}
}
