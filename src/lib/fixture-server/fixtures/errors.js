const FIXTURES = [
  {
    name: '/error',
    bodyTemplate: context => {
      let query = context.query || {}
      let message = query.message || `A regular console.error`
      return `<script>console.error("${message}")</script>`
    }
  },
  {
    name: '/all-console-logs',
    body: `<script>
      console.log("console log log");
      console.info("console log info");
      console.warn("console log warn");
      console.error("console log error");
      </script>`
  },
  {
    name: '/throw',
    bodyTemplate: context => {
      let query = context.query || {}
      let message = query.message || `A throw in js`
      return `<script>throw new Error("${message}");</script>`
    }
  },
  {
    name: '/timeout',
    bodyTemplate: context => {
      let query = context.query || {}
      let delay = query.delay || 2000
      return `<script>setTimeout(function () {
        throw new Error("Timeout error thrown after ${delay}");
       }, ${delay});</script>`
    }
  }
]

export default  FIXTURES
