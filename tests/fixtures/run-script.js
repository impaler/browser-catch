const assert = require('assert')

const EXPECTED_OPTIONS = {
  json: null,
  verbose: false,
  waitForExist: false,
  waitForExistReverse: false,
  waitForExistMs: 10000,
  pause: 0,
  webdriverHost: '127.0.0.1',
  webdriverPort: 4444,
  driverType: 'phantomjs',
  concurrent: 1
}

const DOGS = [
  'Whippet',
  'Staffordshire',
  'Grey Hound',
  'Boston Terrier'
]

export default async function (client, options) {
  delete options.run
  assert.deepEqual(options, EXPECTED_OPTIONS)
  let result = await client.executeAsync(getDogs)
  assert.deepEqual(result.value, DOGS)
}

function getDogs(done) {
  // runs in the browser
  var dogs = document.querySelectorAll('.breeds li')
  var dogElements = [].slice.call(dogs)
  var dogBreeds = dogElements.map(function(element) {return element.innerText})
  done(dogBreeds)
}
