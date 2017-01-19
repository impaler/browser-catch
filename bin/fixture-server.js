#!/usr/bin/env node

require('babel-polyfill')
require('babel-register')

const fixtureServer = require('../src/lib/fixture-server/server')
const port = process.env.PORT || 4555

const ERRORS = require('../src/lib/fixture-server/fixtures/errors')
const FEATURES = require('../src/lib/fixture-server/fixtures/features')
fixtureServer({routes: [...ERRORS, ...FEATURES], port, verbose: true})
