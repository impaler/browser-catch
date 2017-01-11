import ERRORS from './errors'
import FEATURES from './features'

const ERROR = 'error'

export function resolveFixtures (request) {
  let fixtures = [...ERRORS, ...FEATURES]
    .filter(error => {
      let exactMatch = new RegExp('\\b' + error.name + '\\b')
      return !!request.url.match(exactMatch)
    })
  return fixtures
}

export function fixtureResponse (matchingFixtures, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  })

  const fixtureContent = matchingFixtures.map(renderFixture).join('')

  response.write(`<html>
    <head>
<link rel="icon" href="favicon.ico">
</head>
    <body>
        <h1>Fixtures displaying</h1>
        
        <ul>
        ${matchingFixtures.map(fixture => `<li>${fixture.name}</li>`).join('\n')}
        </ul>
    
        ${fixtureContent}
    </body>
</html>`)

  response.end()
}

function renderFixture (fixture) {
  return `
${fixture.script ? wrapScriptElement(fixture.script()) : ''}

${fixture.body ? fixture.body() : ''}
`
}

function wrapScriptElement (content) {
  return `
        <script type="text/javascript">
            ${content}
        </script>
`
}

function renderScript (errorContent) {
  return `
        error.script


`
}
