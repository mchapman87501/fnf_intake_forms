import type { RequestEvent } from "@sveltejs/kit"
import { json } from '@sveltejs/kit'
import { createObjectCsvWriter } from "csv-writer"
import path from 'path';
import fsPromises from 'fs/promises'

export const prerender = false

const dataDir = path.join(process.cwd(), "data", "out")

export async function POST(event: RequestEvent): Promise<Response> {

    let formParams: { [index: string]: any } = await event.request.json()

    // Wow, this is really verbose...
    const headers = [
        { id: "intake_date", title: "Intake Date" },
        { id: "received_by", title: "Received By" },
    ]
    const catInfo = formParams["cat_info"]
    const receivedFrom = formParams["received_from"]
    const records = [
        {
            "intake_date": catInfo.intakeDate,
            "received_by": catInfo.intakeFnFRepr
        }
    ]
    console.log("Received form data: %o", formParams)


    const catName: string = catInfo.catName
    const intakeDate: string = catInfo.intakeDate // TODO verify MMDDYY
    const humanName: string = receivedFrom.fromName
    const rawStem = `${catName}-${humanName}-${intakeDate}`
    // Needed: filename sanitization rules.
    const validStemChars = Array.from(rawStem).flatMap((c) => {
        if (c.match(/(\w|-)/)) {
            return c
        } else if (c.match(/\s/)) {
            return "_"
        } else {
            return ""
        }
    })
    const csvFilename = validStemChars.join("")

    const csvPathname = path.join(dataDir, csvFilename + ".csv")
    try {
        await fsPromises.mkdir(dataDir, { recursive: true })

        const fileWriter = createObjectCsvWriter({
            path: csvPathname,
            header: headers
        })
        await fileWriter.writeRecords(records)

        const result = await fsPromises.readFile(csvPathname, { encoding: "utf-8" })
        const response = json(result)
        console.log("Wrote to %o", csvPathname)
        console.log("String result: %o", result)
        return response
    } catch (e: any) {
        console.error(e.message)
        return json("Failed to save intake record")
    }

}
