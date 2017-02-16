

let what
try {
  require('babel-register')({
    presets: [ 'es2015' ]
  });

  what = require('/tmp/ed342ff0-9dd4-40f1-911f-9eb7a6beeb30/urls-config-test.js')
} catch (error) {
  console.error(what)
}

console.log(what)

