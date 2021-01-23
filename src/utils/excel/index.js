export function export2Excel(columns, list, excelName) {
  require.ensure([], () => {
    const { export_json_to_excel } = require('./Export2Excel')
    const tHeader = []
    const filterVal = []
    columns.forEach(item => {
      tHeader.push(item.label)
      filterVal.push(item.value)
    })
    const data = list.map(v => filterVal.map(j => v[j]))
    export_json_to_excel(tHeader, data, excelName)
  })
}
