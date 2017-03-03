import fixtureServer from '../../../src/lib/fixture-server'
import ERRORS from './errors'
import FEATURES from './features'

const FIXTURES = [...ERRORS, ...FEATURES]

export default function () {
  let routes = {
    routes: FIXTURES
  }
  return fixtureServer(routes)
}
