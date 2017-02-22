#!/usr/bin/env node

require('babel-polyfill')
require('babel-register')

const fixtureServer = require('../src/lib/fixture-server/server').default
const port = process.env.PORT || 4555

const ERRORS = require('../tests/fixtures/server/errors').default
const FEATURES = require('../tests/fixtures/server/features').default
fixtureServer({routes: [...ERRORS, ...FEATURES], port, verbose: true})
