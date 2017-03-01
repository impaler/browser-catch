const fs = require('fs')
const babelCore = require('babel-core')

import { BABEL_CONFIG } from '../constants'

export async function readFile (filePath) {
  if (/.js$/.test(filePath)) {
    return readFileBabel(filePath)
  } else if (/.json$/.test(filePath)) {
    return require(filePath)
  }
}

export async function readFileBabel (filePath) {
  return new Promise(onReadFileBabel)

  function onReadFileBabel (resolve, reject) {
    fs.readFile(filePath, 'utf8', onReadFile)

    function onReadFile (error, fileContent) {
      if (error) reject(error)

      let fileCode = babelCore.transform(fileContent, BABEL_CONFIG)
      let file = fileCode.code
      let fileContext = requireFromString(file)
      resolve(fileContext.default)
    }
  }
}

export async function requireToString (npm) {
  return new Promise(onRequireToString)

  function onRequireToString (resolve, reject) {
    const promisePolyfillPath = require.resolve(npm)
    fs.readFile(promisePolyfillPath, 'utf8', onReadFile)

    function onReadFile (error, fileContent) {
      if (error) reject(error)

      resolve(fileContent)
    }
  }
}

export function requireFromString (src, filename) {
  filename = filename || ''
  let Module = module.constructor
  let m = new Module(filename, module.parent)
  m._compile(src, filename)
  return m.exports
}
