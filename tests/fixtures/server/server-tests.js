export const HTML_TEMPLATE_FIXTURE = {
  name: '/query',
  head: `<link type="text/css" href="some-styles.css" />`,
  body: `<h2>Override body</h2>`,
  htmlTemplate: context => `
<html>
  <head>
    ${context.head}
  </head>
  <body>
    <h1>${JSON.stringify(context.query)}</h1>
    ${context.body}
  </body>
</html>`
}
