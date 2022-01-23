import express from 'express'
import { WebSocketServer } from 'ws'

export function createApp () {
  const app = express()

  app.get('/', async (req, res) => {
    res.send('Hello World')
  })
  return app
}

export function createWebSocketServer (server, path) {
  const wss = new WebSocketServer({
    noServer: true
  })

  server.on('upgrade', (req, sock, head) => {
    const pathname = req.url
    if (pathname.startsWith(path)) {
      wss.handleUpgrade(req, sock, head, ws => {
        wss.emit('connection', ws, req)
      })
    }
  })
  return wss
}

export function listen (server, port) {
  server.listen(port, '0.0.0.0', () => {
    console.info(`Server listening on port: ${port}`)
  })
}
