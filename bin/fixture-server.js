#!/usr/bin/env node

require('babel-polyfill')
require('babel-register')

const fixtureServer = require('../src/lib/server/server')
const port = process.env.PORT || 4555

const ERRORS = require('../src/lib/server/fixtures/errors')
fixtureServer({routes: ERRORS, port, verbose: true})
