const figures = require('figures')
const colors = require('ansicolors')

export function report (errorCount) {
  if (errorCount > 0) {
    console.error(colors.red(
      figures(`✖ Error ${errorCount} console errors`)
    ))
  } else {
    console.log(colors.green(
      figures('✔ Pass no console errors')
    ))
  }
}

export function reportSingle (result) {
  if (result.errors.length > 0) {
    console.log(colors.white(JSON.stringify(result, null, 4)))
  } else {
    console.log(colors.blue(JSON.stringify(result, null, 4)))
  }
}
