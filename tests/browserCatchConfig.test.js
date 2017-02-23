import test from 'ava'
const path = require('path')
const fixtureServer = require('./fixtures/server/server').default
const browserCatchConfig = require('../src/index').browserCatchConfig
const { stripResult } = require('./helpers/result')
const { writeTempJSFile, writeTempJSONFile } = require('./helpers/io')
const DRIVER_TYPE = 'phantomjs'

test('running a config in es6 with an array of urls', async t => {
  const serverSettings = await fixtureServer()
  let configPath = await writeTempJSFile({
    urls: [
      `${serverSettings.url}/error`,
      `${serverSettings.url}/throw`,
      `${serverSettings.url}/throw`,
      `${serverSettings.url}/error`,
    ]
  }, 'urls-config-test.js')

  const results = await browserCatchConfig(configPath)
  t.is(results.length, 4)

  for (let result of results) {
    t.is(result.driverType, DRIVER_TYPE)
    t.is(result.errors.length, 1)
  }

  const snapshot = stripResult(results, serverSettings.port)
  t.snapshot(snapshot)
})

test('running a config in json with an array of urls', async t => {
  const serverSettings = await fixtureServer()
  let configPath = await writeTempJSONFile({
    urls: [
      `${serverSettings.url}/error`,
      `${serverSettings.url}/throw`,
      `${serverSettings.url}/throw`,
      `${serverSettings.url}/error`,
    ]
  }, 'urls-config-test.json')

  const results = await browserCatchConfig(configPath)
  t.is(results.length, 4)

  for (let result of results) {
    t.is(result.driverType, DRIVER_TYPE)
    t.is(result.errors.length, 1)
  }

  const snapshot = stripResult(results, serverSettings.port)
  t.snapshot(snapshot)
})
