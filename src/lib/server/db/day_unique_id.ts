import type Database from 'better-sqlite3'

export class DayUniqueID {
	#db: Database.Database

	constructor(db: Database.Database) {
		this.#db = db
		this.#initSchema()
	}

	#initSchema() {
		const queries = [
			`CREATE TABLE IF NOT EXISTS DayUniqueID(
                id INTEGER NOT NULL, -- Use this to enforce only one record
                date TEXT NOT NULL, -- Date in a standard string format
                unique_id INTEGER NOT NULL,
                UNIQUE(id)
            )`
		]
		for (const query of queries) {
			this.#db.prepare(query).run()
		}
	}

	#dateStr(date: Date): string {
		return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
	}

	/**
	 * Get the next day-uniqueID.
	 * NOTE: date should never decrease from one invocation to the next.
	 * @param date date for which to get the next day-unique ID
	 * @returns the next day-unique ID
	 */
	consumeDayUniqueID(date: Date): number {
		const getCurr = this.#db.prepare('SELECT id, date, unique_id FROM DayUniqueID WHERE id = 1')
		const advance = this.#db.prepare(
			'INSERT OR REPLACE INTO DayUniqueID (id, date, unique_id) VALUES (@id, @date, @unique_id)'
		)

		return this.#db.transaction(() => {
			const dateStr = this.#dateStr(date)
			const row = getCurr.get() || { id: 1, date: 'no matching records', unique_id: 0 }

			if (row.date != dateStr) {
				row.date = dateStr
				row.unique_id = 1
			} else {
				row.unique_id += 1
			}
			advance.run(row)
			return row.unique_id
		})()
	}
}
