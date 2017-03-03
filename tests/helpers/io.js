const tempWrite = require('temp-write')
const util = require('util')

export async function writeTempJSFile (content, filePath) {
  const fileContent = `export default ${util.inspect(content)}`
  return tempWrite(fileContent, filePath)
}

export async function writeTempJSONFile (content, filePath) {
  const fileContent = JSON.stringify(content, null, 4)
  return tempWrite(fileContent, filePath)
}
