<script lang="ts" context="module">
export function getIntakeInfoAsCSV(tableInfo : string[][]): string {
    function valueToCSV(v: string): string {
        const quoted = v.replaceAll('"', '""')
        return `"${quoted}"`
    }

    function rowToStr2(row: Array<string>): string {
        return row.map((col) => valueToCSV(col)).join(',')
    }

    return tableInfo
        .map((row) => rowToStr2(row))
        .join('\n')
}
</script>