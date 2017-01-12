const assert = require('assert')

const EXPECTED_OPTIONS = {
  pause: 0,
  webdriverHost: '127.0.0.1',
  webdriverPort: 4444,
  driverType: 'phantomjs',
  json: true,
  verbose: false,
  waitForExist: false,
  waitForExistMs: 10000,
  waitForExistReverse: false
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
  console.log(result)
  assert.deepEqual(result.value, DOGS)
}

function getDogs(done) {
  var dogs = document.querySelectorAll('.breeds li')
  var dogElements = [].slice.call(dogs)
  var dogBreeds = dogElements.map(element => element.innerText)
  done(dogBreeds)
}
