import type { RequestEvent } from "@sveltejs/kit"
import { json } from '@sveltejs/kit'
import { createObjectCsvWriter } from "csv-writer"
import path from 'path';
import fsPromises from 'fs/promises'

export const prerender = false

const dataDir = path.join(process.cwd(), "data", "out")


type CatPkg = any
type ReceivedFromPkg = any

function getRows(catInfo: CatPkg, recvdFrom: ReceivedFromPkg) {
    return [
        { "name": "Intake Date", "value": catInfo.intakeDate, "comments": "" },
        { "name": "Received By", "value": catInfo.intakeFnFRepr, "comments": "" },
        { "name": "Received From", "value": recvdFrom.fromName, "comments": "" },
        { "name": "Street Address", "value": recvdFrom.address, "comments": "" },
        { "name": "City", "value": recvdFrom.city, "comments": "" },
        { "name": "State", "value": recvdFrom.state, "comments": "" },
        { "name": "Zip code", "value": recvdFrom.zip, "comments": "" },
        { "name": "Cell/Home phone", "value": recvdFrom.phone, "comments": "" },
        { "name": "Email Address", "value": recvdFrom.email, "comments": "" },
        { "name": "Reason for surrender", "value": catInfo.intakeReason, "comments": "" },
        { "name": "Shelter Number", "value": recvdFrom.shelterNum, "comments": "" },
        { "name": "Cat's name", "value": catInfo.catName, "comments": "" },
        { "name": "DOB", "value": catInfo.DOB, "comments": "" },
        { "name": "Gender", "value": catInfo.gender, "comments": "" }
    ]
}

export async function POST(event: RequestEvent): Promise<Response> {

    let formParams: { [index: string]: any } = await event.request.json()

    const headers = [
        { id: "name", title: "" },
        { id: "value", title: "INFO" },
        { id: "comments", title: "COMMENTS" }
    ]
    const catInfo = formParams["cat_info"]
    const receivedFrom = formParams["received_from"]
    const records = getRows(catInfo, receivedFrom)

    // Generate a filename:
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
    const csvFilename = validStemChars.join("").replaceAll(/[_-][_-]+/g, "_") + ".csv"

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
