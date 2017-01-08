import test from 'ava'

require('babel-polyfill')
require('babel-register')

const server = require('./../../src/lib/error-server/fixture-server')
const fork = require('./../../src/lib/fork')
const {stripDefaultReporterHack} = require('./../helpers/result')

test.beforeEach(async t => {
  t.context.server = await server()
})

test.afterEach(async t => {
  await t.context.server.kill()
})

test('phantomjs catch 1 errors', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}/error`])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('phantomjs catch 1 errors to stdout json', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}/error`, '--json'])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 1)
  t.snapshot(errorsParsed)
})

test('phantomjs catch 0 errors', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}`])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})

test('phantomjs catch 0 errors to stdout json', async t => {
  const port = t.context.server.port
  const errors = await fork([`localhost:${port}`, '--json'])
  const errorsParsed = stripDefaultReporterHack(errors.stdout, port)

  t.is(errorsParsed.driverType, 'phantomjs')
  t.is(errorsParsed.errors.length, 0)
  t.snapshot(errorsParsed)
})
