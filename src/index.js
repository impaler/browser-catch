import loadDriver from './drivers/driver'
import { create, getBrowserLogs, gotoUrl } from './client/webdriverio-log'
export { create, getBrowserLogs, gotoUrl } from './client/webdriverio-log'
const seriesSettled = require('promise-sequences').seriesSettled
const fs = require('fs')
const babelCore = require('babel-core')

const BABEL_CONFIG = {
  babelrc: false,
  presets: [
    "es2017"
  ],
  plugins: [
    "transform-es2015-modules-commonjs",
    "transform-es2015-spread"
  ]
}

export const DEFAULT_OPTIONS = {
  json: null,
  verbose: false,
  waitForExist: false,
  waitForExistReverse: false,
  waitForExistMs: 10000,
  pause: 0,
  run: null,
  webdriverHost: '127.0.0.1',
  webdriverPort: 4444,
  driverType: 'phantomjs',
  concurrent: 1
}

export const TYPE = {
  url: 'url',
  config: 'config',
}

export async function browserCatch (task, options) {
  if (task.type === TYPE.url) {
    return browserCatchUrl(task.url, options)
  } else if (task.type === TYPE.config) {
    return browserCatchConfig(task.path, options)
  } else {
    throw new Error(`browserCatch unknown task TYPE, please specify a type such as ${Object.keys(TYPE)}`)
  }
}

export async function browserCatchConfig (configPath, options) {
  options = assignDefaultOptions(options)

  let config = await readFile(configPath)
  let results

  if (config && config.urls) {
    let tasks = config.urls.map(url => () => browserCatchUrl(url, options))
    results = await seriesSettled(tasks, options.concurrent)

    let errors = results.filter(result => result.state !== 'resolved')
    if (errors.length > 0) {
      if (options.verbose) {
        errors.forEach(error => console.error(error))
      }
      throw new Error(`There were ${errors.length} errors in the task`)
    }

    return results
  } else {
    throw new Error('browserCatchConfig you need to provide a config["urls"] array in your config object')
  }
}

export async function browserCatchUrl (url, options) {
  options = assignDefaultOptions(options)
  let driver

  try {
    if (options.verbose) console.log(`Creating webdriver client`)

    driver = await loadDriver(options)
    let client = create(driver.webdriverOptions, options)
    await client.init()

    if (options.verbose) console.log(`Webdriver client created using .gotoUrl ${url}`)

    let start = Date.now()
    await gotoUrl(client, url)

    if (options.run) {
      let script = await loadScript(options.run, client, options)
      await runScript(script, client, options)
    }

    // http://webdriver.io/api/utility/waitForExist.html
    if (options.waitForExist) {
      if (options.verbose) console.log(`
Now waitForExist selector ${options.waitForExist} 
for ${options.waitForExistMs}ms & reverse ${options.waitForExistReverse}
`)
      await client.waitForExist(
        options.waitForExist,
        options.waitForExistMs,
        options.waitForExistReverse
      )
    }

    if (options.pause) {
      if (options.verbose) console.log(`Starting to pause for ${options.pause}ms`)
      await client.pause(options.pause)
    }

    let errors = await getBrowserLogs(client, options)

    let end = Date.now()
    await client.end()
    driver.kill()

    return {
      start,
      end,
      url,
      driverType: options.driverType,
      errors,
      options,
    }
  } catch (error) {
    if (driver) driver.kill()

    throw error
  }
}

export function assignDefaultOptions (options) {
  let assigned = Object.assign({}, DEFAULT_OPTIONS, options)
  if (assigned.verbose) console.log(assigned)
  return assigned
}

async function runScript (customScript, client, options) {
  try {
    await customScript(client, options)
  } catch (error) {
    if (options.verbose) console.error(`custom script has thrown an error`, error)
    throw error
  }
}

async function loadScript (scriptPath, client, options) {
  if (options.verbose) console.log(`Loading run script from path ${options.run}`)

  let customScript

  try {
    customScript = await readFileBabel(scriptPath)
  } catch (error) {
    console.error(`Could not load script your --run option ${scriptPath}`)
    throw error
  }

  return customScript
}

async function readFile (filePath) {
  if (/.js$/.test(filePath)) {
    return readFileBabel(filePath)
  } else if (/.json$/.test(filePath)) {
    return require(filePath)
  }
}

async function readFileBabel (filePath) {
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

async function requireToString (npm) {
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

function requireFromString (src, filename) {
  filename = filename || '';

  var Module = module.constructor
  // console.error(filename)
  var m = new Module(filename, module.parent)
  m._compile(src, filename)
  return m.exports;
}
