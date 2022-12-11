<script lang="ts" context="module">
	export function getInfoAsCSV(tableInfo: string[][]): string {
		function valueToCSV(v: string): string {
			const quoted = v.replaceAll('"', '""')
			return `"${quoted}"`
		}

		function rowToStr(row: Array<string>): string {
			return row.map((col) => valueToCSV(col)).join(',')
		}

		return tableInfo.map((row) => rowToStr(row)).join('\n')
	}

	export function todayStr(): string {
		function pad(s: string, len: number): string {
			const overPadded = '00000000' + s
			return overPadded.substring(overPadded.length - len)
		}
		// Satisfy browsers like chrome that require
		// 'yyyy-mm-dd' as their input.
		const today = new Date()
		const year = today.getFullYear()
		const month = today.getMonth() + 1
		const day = today.getDate()

		const yStr = pad(year.toFixed(0), 4)
		const mStr = pad(month.toFixed(0), 2)
		const dStr = pad(day.toFixed(0), 2)
		const result = `${yStr}-${mStr}-${dStr}`
		return result
	}
</script>
