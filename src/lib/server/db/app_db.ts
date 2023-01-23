import * as path from 'path'
import fsPromises from 'fs/promises'
import Database from 'better-sqlite3'

import { RescueID } from './rescue_id'
import { User } from './user'

export async function newDB(dbPath: string): Promise<Database.Database> {
	if (dbPath.toLowerCase() != ':memory') {
		const dbDataDir = path.dirname(path.resolve(dbPath))
		await fsPromises.mkdir(dbDataDir, { recursive: true })
	}

	const result = new Database(dbPath)
	result.pragma('journal_mode = WAL')
	result.pragma('foreign_keys = ON')
	process.on('exit', () => result.close())
	return result
}

export class AppDB {
	readonly rescueID: RescueID
	readonly user: User

	constructor(db: Database.Database) {
		//  I guess these are data models, or table managers, or something.
		this.rescueID = new RescueID(db)
		this.user = new User(db)
	}
}
