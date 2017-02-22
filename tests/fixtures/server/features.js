const FIXTURES = [
  {
    name: '/append-element-after',
    bodyTemplate: context => {
      let duration = context.query.duration || 5000
      let className = context.query.className || `appended-after-${duration}`
      return `
  <script type="text/javascript">
  console.error('error before the element is appended')
    setTimeout(function() {
      var paragraphElement = document.createElement("p");
      paragraphElement.className = "${className}";
      paragraphElement.innerText = "Boo!!! I have appeared after ${duration}ms";
      document.body.appendChild(paragraphElement);
      console.error('thrown error after the element is appended')
    }, ${duration})
  </script>
`
    }
  },
  {
    name: '/wait-for-throws',
    bodyTemplate: context => {
      var duration = context.query.duration || 5000
      var className = context.query.className || `appended-after-${duration}`
      return `
  <script type="text/javascript">
  console.log('append')
    setTimeout(function() {
      var paragraphElement = document.createElement("p");
      paragraphElement.className = "${className}";
      paragraphElement.innerText = "Boo!!! I have appeared after ${duration}ms";
      document.body.appendChild(paragraphElement);
      setTimeout(function() { throw 'wow' }, 500)
    }, ${duration})
  </script>
`
    }
  },
  {
    name: '/dogs',
    body: `
  <ul class="breeds">
    <li>Whippet</li>
    <li>Staffordshire</li>
    <li>Grey Hound</li>
    <li>Boston Terrier</li>
  </ul>
`
  },
  {
    name: '/cats',
    body: `
  <ul class="breeds">
    <li>Siamese</li>
    <li>Ragdoll</li>
    <li>Persian</li>
    <li>Munchkin</li>
  </ul>
`
  },
]

export default  FIXTURES
