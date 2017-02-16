import test from 'ava'
const path = require('path')
const tempWrite = require('temp-write')

require('isomorphic-fetch')
require('babel-register')

const fixtureServer = require('../../src/lib/fixture-server/server').default
const ERRORS = require('../../src/lib/fixture-server/fixtures/errors').default
const FEATURES = require('../../src/lib/fixture-server/fixtures/features').default
const FIXTURES = [...ERRORS, ...FEATURES]

// const fork = require('./../../src/lib/fork').default
const {forkBin} = require('./../../src/lib/fork')
const fork = forkBin
const {stripDefaultReporterHack} = require('./../helpers/result')

test('phantomjs catch 1 error', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})
  const errors = await t.throws(fork(`${serverSettings.url}/error --json`))
  t.is(errors.code, 1)

  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('phantomjs catch 1 error to stdout json', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})
  const errors = await t.throws(fork(`${serverSettings.url}/error --json`))
  t.is(errors.code, 1)

  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('phantomjs catch 0 errors', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})
  const errors = await fork(`${serverSettings.url} --json`)
  t.is(errors.code, 0)

  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('phantomjs catch 0 errors to stdout json', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})
  const errors = await fork(`${serverSettings.url} --json`)
  t.is(errors.code, 0)

  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('phantomjs option waitFor', async t => {
  const serverSettings = await fixtureServer({routes: FIXTURES})
  const errors = await fork(`${serverSettings.url}/append-element-after -f .appended-after-5000`)
  t.is(errors.code, 0)

  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('phantomjs option waitForExist with a throw just after', async t => {
  const serverSettings = await fixtureServer({routes: FIXTURES})
  const errors = await t.throws(fork(`${serverSettings.url}/wait-for-throws -f .appended-after-2000 -p 2000`))
  t.is(errors.code, 1)

  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test.only('phantomjs option run a custom async script with webdriver calls', async t => {
  const serverSettings = await fixtureServer({routes: FIXTURES})
  const scriptPath = path.resolve(__dirname, '../fixtures/custom-run.js')
  const errors = await fork([`${serverSettings.url}/dogs`, '--run', `${scriptPath}`, `--json`])
  t.is(errors.code, 0)

  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('phantomjs given a set of urls in a js file catch any errors', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})

  let configPath = await writeTempJSFile({
    urls: [
      `${serverSettings.url}/throw`,
      `${serverSettings.url}/error`
    ]
  }, 'urls-config-test.js')

  const errorProcess = await t.throws(fork([configPath, '--json']))

  t.is(errorProcess.error.code, 2)

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

  const errorProcess = await t.throws(fork([configPath, '--json']))

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
