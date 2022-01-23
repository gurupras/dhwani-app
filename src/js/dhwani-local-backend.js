export default class DhwaniBackend {
  /**
   *
   * @param {WebSocket} ws
   */
  constructor (ws) {
    this.ws = ws
  }

  /**
   * Assign the native backend an ID
   * @param {String} id
   */
  setID (id) {
    this.ws.send(JSON.stringify({
      action: 'set-id',
      data: id
    }))
  }

  startRTPServer () {
    const { ws } = this
    const promise = new Promise(resolve => {
      ws.addEventListener('message', function once (msg) {
        const json = JSON.parse(msg.data)
        const { action, data } = json
        if (action !== 'started-rtp-server') {
          return
        }
        ws.removeEventListener('message', once)
        resolve(data)
      })
    })
    ws.send(JSON.stringify({
      action: 'start-rtp-server'
    }))
    return promise
  }
}
