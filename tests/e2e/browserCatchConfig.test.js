import test from 'ava'
const path = require('path')
const tempWrite = require('temp-write')

require('isomorphic-fetch')
require('babel-register')

const fixtureServer = require('../../src/lib/fixture-server/server').default
const ERRORS = require('../../src/lib/fixture-server/fixtures/errors').default
const FEATURES = require('../../src/lib/fixture-server/fixtures/features').default
const FIXTURES = [...ERRORS, ...FEATURES]

const browserCatchUrl = require('../../dist').browserCatchUrl

// const fork = require('./../../src/lib/fork').default
// const {forkBin} = require('./../../src/lib/fork')
// const fork = forkBin
const {stripResult} = require('./../helpers/result')

const DRIVER_TYPE = 'phantomjs'

test.skip('phantomjs given a set of urls in a js file catch any errors', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})

  let configPath = await writeTempJSFile({
    urls: [
      `${serverSettings.url}/throw`,
      `${serverSettings.url}/error`
    ]
  }, 'urls-config-test.js')

  const errorProcess = await t.throws(fork(`${configPath} --json`))

  t.is(errorProcess.code, 2)

  console.log(errorProcess.stderr)

  const errorsParsed = stripDefaultReporterHack(errorProcess.stdout, serverSettings.port)

  errorsParsed.forEach(error => {
    t.is(error.driverType, 'phantomjs')
    t.is(error.errors.length, 1)
  })

  t.snapshot(errorsParsed)
})

test('phantomjs given a set of urls in a json file catch any errors', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})

  let configPath = await writeTempJSONFile({
    urls: [
      `${serverSettings.url}/throw`,
      `${serverSettings.url}/error`
    ]
  }, 'urls-config-test.json')

  const errorProcess = await t.throws(fork(`${configPath} --json`))

  t.is(errorProcess.error.code, 2)

  const errorsParsed = stripDefaultReporterHack(errorProcess.stdout, serverSettings.port)

  errorsParsed.forEach(error => {
    t.is(error.driverType, 'phantomjs')
    t.is(error.errors.length, 1)
  })

  t.snapshot(errorsParsed)
})

async function writeTempJSONFile(content, filePath) {
  const fileContent = JSON.stringify(content, null, 4)
  return tempWrite(fileContent, filePath)
}

async function writeTempJSFile(content, filePath) {
  const util = require('util')
  const fileContent = `export default ${util.inspect(content)}`
  return tempWrite(fileContent, filePath)
}
