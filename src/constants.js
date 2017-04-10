export const PHANTOMJS = 'phantomjs'
export const CHROME = 'chrome'

export const DRIVER_TYPES = {
  PHANTOMJS,
  CHROME
}

export const BROWSER_LOG_LEVELS = {
  WARNING: 'WARNING',
  INFO: 'INFO',
  SEVERE: 'SEVERE'
}

export const BABEL_CONFIG = {
  babelrc: false,
  presets: [
    'es2017'
  ],
  plugins: [
    'transform-es2015-modules-commonjs',
    'transform-es2015-spread'
  ]
}

export const DEFAULT_OPTIONS = {
  json: null,
  verbose: false,
  waitForExist: false,
  waitForExistReverse: false,
  waitForExistMs: 10000,
  pause: 0,
  run: null,
  webdriverHost: '127.0.0.1',
  webdriverPort: 4444,
  driverType: 'phantomjs',
  concurrent: 1
}

export const CONFIG_TYPE = {
  url: 'url',
  config: 'config',
}
