import SimplePeer from 'simple-peer/simplepeer.min'

/**
 *
 * @param {String} id
 * @param {String} to
 * @param {import('simple-peer').Options} simplePeerConfig
 * @param {String} websocketURL
 * @returns
 */
export function createPeer (id, to, simplePeerConfig, websocketURL) {
  const ws = new WebSocket(websocketURL)
  return new Promise((resolve, reject) => {
    ws.addEventListener('open', () => {
      ws.addEventListener('message', (msg) => {
        const json = JSON.parse(msg.data)
        const { action } = json
        switch (action) {
          case 'signal': {
            const decoded = atob(json.data)
            const data = JSON.parse(decoded)
            peer.emit('remote-signal', data)
            console.log('remote-signal', data)
            peer.signal(data)
          }
        }
      })
      const peer = new SimplePeer(simplePeerConfig)
      peer.on('signal', data => {
        console.log('signal', data)
        ws.send(JSON.stringify({
          from: id,
          to,
          action: 'signal',
          type: data.type,
          data: btoa(JSON.stringify(data))
        }))
      })
      resolve(peer)
    })
  })
}
