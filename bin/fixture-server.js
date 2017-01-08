#!/usr/bin/env node

require('babel-polyfill')

const server = require('../dist/lib/error-server/fixture-server')
const port = process.env.PORT || 4555

server(port)
