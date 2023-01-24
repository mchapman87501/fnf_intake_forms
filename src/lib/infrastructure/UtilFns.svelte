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

	function dfmt(n: number, width: number): string {
		return n.toFixed(0).padStart(width, '0')
	}

	export function todayStr(): string {
		// Satisfy browsers like chrome that require
		// 'yyyy-mm-dd' as their input.
		const today = new Date()
		const yStr = dfmt(today.getFullYear(), 4)
		const mStr = dfmt(today.getMonth() + 1, 2)
		const dStr = dfmt(today.getDate(), 2)
		const result = `${yStr}-${mStr}-${dStr}`
		return result
	}
</script>
