import path from 'path'
import test from 'ava'

require('isomorphic-fetch')
require('babel-polyfill')
require('babel-register')

const fixtureServer = require('../../src/lib/fixture-server/server')
const ERRORS = require('../../src/lib/fixture-server/fixtures/errors')
const FEATURES = require('../../src/lib/fixture-server/fixtures/features')
const FIXTURES = [...ERRORS, ...FEATURES]

const fork = require('./../../src/lib/fork')
const {stripDefaultReporterHack} = require('./../helpers/result')

test('phantomjs catch 1 errors', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})
  const errors = await fork(`${serverSettings.url}/error --json`)
  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('phantomjs catch 1 errors to stdout json', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})
  const errors = await fork(`${serverSettings.url}/error --json`)
  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('phantomjs catch 0 errors', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})
  const errors = await fork(`${serverSettings.url} --json`)
  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('phantomjs catch 0 errors to stdout json', async t => {
  const serverSettings = await fixtureServer({routes: ERRORS})
  const errors = await fork(`${serverSettings.url} --json`)
  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('phantomjs option waitFor', async t => {
  const serverSettings = await fixtureServer({routes: FIXTURES})
  const errors = await fork(`${serverSettings.url}/append-element-after -f .appended-after-5000`)
  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('phantomjs option waitForExist with a throw just after', async t => {
  const serverSettings = await fixtureServer({routes: FIXTURES})
  const errors = await fork(`${serverSettings.url}/wait-for-throws -f .appended-after-2000 -p 2000`)
  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('phantomjs option run a custom async script with webdriver calls', async t => {
  const serverSettings = await fixtureServer({routes: FIXTURES})
  const scriptPath = path.resolve(__dirname, '../fixtures/custom-run.js')
  const errors = await fork(`${serverSettings.url}/dogs --run ${scriptPath} --json`)
  const errorsParsed = stripDefaultReporterHack(errors.stdout, serverSettings.port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

// test('phantomjs option run a custom async script that throws', async t => {
//
// })
