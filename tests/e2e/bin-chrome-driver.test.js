import test from 'ava'

require('babel-polyfill')
require('babel-register')

const fixtureServer = require('../../src/lib/fixture-server/server')
const ERRORS = require('../../src/lib/fixture-server/fixtures/errors')
const FEATURES = require('../../src/lib/fixture-server/fixtures/features')
const FIXTURES = [...ERRORS, ...FEATURES]
const fork = require('./../../src/lib/fork')
const {stripDefaultReporterHack} = require('./../helpers/result')

test('ChromeDriver catch 1 error', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})
  const errors = await fork(`${serverSettings.url}/error --driver chrome --json`)
  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'chrome')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('ChromeDriver catch 0 errors', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})
  const errors = await fork(`${serverSettings.url} --driver chrome`)
  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'chrome')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('ChromeDriver catch 0 errors to stdout & json', async t => {
  const serverSettings = await fixtureServer()
  const errors = await fork(`${serverSettings.url} --driver chrome --json`)
  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'chrome')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('ChromeDriver throws error when testing a url with a 404', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})
  const errors = await fork(`${serverSettings.url}/404 --driver chrome --json`)
  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'chrome')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

// Requires a custom selenium server url & port running
// Makes testing the rest in prallel difficult when the selenium/standalone-chrome
// fails with xvfb-run: error: Xvfb failed to start when more than one is running
// So it needs to be a separate test run
//
// test('webdriver-custom-url ChromeDriver catches 0 errors and works with custom selenium url', async t => {
//     const serverSettings = await fixtureServer({routes: ERRORS})
//     const errors = await fork(`${serverSettings.url}/404 --driver chrome --json --webdriver-port 3445 --webdriver-host localhost`)
//     const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)
//
//     t.is(errorsParsed.driverType, 'chrome')
//     t.is(errorsParsed.errors.length, 0)
//     t.snapshot(errorsParsed)
// })
