// server-next.js
import next from 'next'
import { createServer } from 'http'

const app = next({ dev: true })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(5000, () => {
    console.log('> Ready on http://localhost:5000')
  })
})