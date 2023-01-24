import { getDownloadInfo, type DownloadInfo } from '$lib/api_support/download_info'
import { dateStr } from './value_converters'
import type { SurrenderPkg } from '$lib/infrastructure/info_packages'
import { writeWideCSV, type WideCSVColumn, col } from './wide_csv_writer'

function getIntakeFormRow(rescueID: string, surrenderInfo: SurrenderPkg): WideCSVColumn[] {
	const catInfo = surrenderInfo.catInfo
	const recvdFrom = surrenderInfo.receivedFrom
	// See Github Issue #9
	return [
		col('Location', ''),

		// How to know which of these should take the catName?
		col('Adult cat/mama cat name', catInfo.catName),
		col('KITTEN NAME', ''),

		col('INTAKE DATE', dateStr(catInfo.intakeDate)),
		col('SOURCE/intake info', ''),
		col('RESCUE ID', rescueID),

		// Again, what to do about kittens?
		col('GENDER', catInfo.gender),
		col('BREED/COLOR', `${catInfo.breed}/${catInfo.color}`),
		col('DOB', dateStr(catInfo.DOB)),
		col('Weight/date', `${catInfo.currentWeight}/`), // TBD weigh date
		col('CHIP#', catInfo.microchipNum),
		col('FVRCP#1 date (due at >=2lbs', dateStr(catInfo.FVRCP1)),
		col('FVRCP#2 (due 3--4 weeks after #1)', dateStr(catInfo.FVRCP2)),
		col('FVRCP#3', dateStr(catInfo.FVRCP3)),
		col('DEWORMED date', ''),
		col('RABIES vax date', ''),
		col('TESTED date (neg unless stated', ''), // Is this the rabies test date?
		col('S/N date', dateStr(catInfo.alteredDate)),
		col('Check this box when added to Portal', ''),
		col('Check this box when added to Pawlytics', ''),
		col('Notes', '')
	]
}

export async function saveWideIntakeForm(
	rescueID: string,
	surrenderInfo: SurrenderPkg,
	csvPathname: string
): Promise<DownloadInfo> {
	try {
		await writeWideCSV(csvPathname, getIntakeFormRow(rescueID, surrenderInfo))
		return getDownloadInfo(csvPathname)
	} catch (e: any) {
		return Promise.reject(e.message)
	}
}