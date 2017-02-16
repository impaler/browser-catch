import loadDriver from './drivers/driver'
import { create, getBrowserLogs, gotoUrl } from './client/webdriverio-log'
export { create, getBrowserLogs, gotoUrl } from './client/webdriverio-log'
const seriesSettled = require('promise-sequences').seriesSettled
const fs = require('fs')
const babelCore = require('babel-core')
const babelrc = {
  babelrc: false,
  presets: [
    "es2017"
  ],
  plugins: [
    "transform-es2015-modules-commonjs",
    "transform-es2015-spread"
  ]
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
  }
}

async function browserCatchConfig (configPath, options) {
  let config = await readFile(configPath)
  let results

  if (config && config.urls) {
    let tasks = config.urls.map(url => () => browserCatchUrl(url, options))
    results = await seriesSettled(tasks, 1)
    results = results.map(item => item.result)
    return results
  } else {
    throw new Error('browserCatchConfig')
  }
}

export async function browserCatchUrl (url, options) {
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
      await runScript(options.run, client, options)
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
      errors
    }
  } catch (error) {
    if (driver) driver.kill()

    throw error
  }
}

async function runScript (scriptPath, client, options) {
  if (options.verbose) console.log(`Using --run script path ${options.run}`)

  try {
    let customScript = await readFileBabel(scriptPath)
    await customScript(client, options)
  } catch (error) {
    console.error(`Could not load script your --run option ${scriptPath}`)
    throw error
  }
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
      let fileCode = babelCore.transform(fileContent, babelrc)
      let fileContext = eval(fileCode.code)
      resolve(fileContext)
    }
  }
}
