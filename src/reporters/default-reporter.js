const figures = require('figures')
const colors = require('ansicolors')

export function report (result) {
  Array.isArray(result) ?
    result.forEach(reportSingle) :
    reportSingle(result)
}

function reportSingle (result) {
  if (result.errors.length > 0) {
    console.log(colors.white(JSON.stringify(result, null, 4)))

    console.error(colors.red(
      figures(`✖ Error ${result.errors.length} console errors`)
    ))
  } else {
    console.log(colors.blue(JSON.stringify(result, null, 4)))

    console.log(colors.green(
      figures('✔ Pass no console errors')
    ))
  }
}
