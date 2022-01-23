require = require('esm')(module) // eslint-disable-line no-global-assign
const http = require('http')
const Config = require('config')

const Server = require('./server')

/** @type {import('../config/default')} */
const config = Config.default

const app = Server.createApp()
const server = http.createServer(app)
const wss = Server.createWebSocketServer(server, config.backend.server.websocketPath)

/** @type {Map<String, import('ws').WebSocket>} */
const socketMap = new Map()

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const id = url.searchParams.get('id')
  if (!id) {
    ws.close()
    return
  }
  console.log('Received new websocket connection: ', id)
  socketMap.set(id, ws)

  ws.on('close', () => {
    console.log('Socket closed', id)
    socketMap.delete(id)
  })

  ws.on('ping', () => {
    ws.pong('{}')
  })

  ws.on('message', (msg) => {
    let json
    try {
      json = JSON.parse(msg)
    } catch (e) {
      console.error(e)
      return
    }
    const { action } = json
    switch (action) {
      case 'heartbeat': {
        ws.send(JSON.stringify({ action: 'heartbeat' }))
        break
      }
      case 'ping': {
        ws.send(JSON.stringify({ action: 'pong', timestamp: Date.now() }))
        break
      }
      case 'signal': {
        const { from, to } = json
        console.log(`Signal ${from} --> ${to}`)
        const targetWS = socketMap.get(to)
        if (targetWS) {
          targetWS.send(msg, { binary: false })
        } else {
          console.warn('Did not find socket with ID: ', to)
        }
        break
      }
    }
  })
})

Server.listen(server, config.backend.server.port)
