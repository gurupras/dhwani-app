<template>
<div class="section wrapper">
  <div class="columns">
    <div class="column is-offset-2-widescreen is-two-thirds-widescreen">
      <div class="section">
        <h5 class="subtitle is-size-5">Enter remote ID</h5>
        <Code :num-digits="9" v-model="store.remotePeerID" ref="code"/>
        <div class="has-text-right">
          <button class="button" :class="{'is-link': store.remotePeerID.length === 9}" :disabled="store.remotePeerID.length !== 9" @click="startConnect">Connect</button>
        </div>
        <audio ref="audio"/>
        <div ref="logs"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
/* global CENTRAL_BACKEND_WEBSOCKET_URL */
import { defineComponent } from 'vue'
import chunk from 'lodash/chunk'
import { v4 as uuidv4 } from 'uuid'
import { createPeer } from '@/js/websocket-peer'
import { useStore } from '@/stores/receive'
export default defineComponent({
  setup () {
    const store = useStore()
    return {
      store
    }
  },
  computed: {
    friendlyRemotePeerID () {
      const chunks = chunk(this.store.remotePeerID, 3)
      return chunks.map(x => x.join('')).join(' ')
    }
  },
  methods: {
    async startConnect () {
      this.$refs.logs.innerHTML = ''

      const id = uuidv4()
      const websocketURL = `${CENTRAL_BACKEND_WEBSOCKET_URL}/?id=${id}`
      const peer = this.peer = await createPeer(id, this.store.remotePeerID, {
        initiator: true,
        config: {
          iceServers: [
            {
              urls: ['stun:stun.l.google.com:19302']
            }
          ]
        },
        offerOptions: {
          offerToReceiveAudio: true
        }
      }, websocketURL)

      const log = (msg, cls) => {
        const div = document.createElement('div')
        if (cls) {
          div.classList.add(cls)
        }
        div.innerHTML = msg
        this.$refs.logs.appendChild(div)
      }

      peer.on('signal', data => {
        log(`Signal us --> ${this.store.remotePeerID} (type=${data.type})`, 'has-text-link')
      })
      peer.on('remote-signal', data => {
        log(`Signal ${this.store.remotePeerID} --> us (type=${data.type})`, 'has-text-warning')
      })
      peer.on('error', data => {
        log(`Error: ${data}`, 'has-text-danger')
      })
      peer.on('connect', () => {
        log(`Connected us <--> ${this.store.remotePeerID}`, 'has-text-success')
      })
      peer.on('close', () => {
        log(`Connection closed us <--> ${this.store.remotePeerID}`, 'has-text-danger')
      })
      peer.on('track', () => {
        log(`Track ${this.store.remotePeerID} --> us`, 'has-text-success')
      })
      peer.on('stream', (stream) => {
        log(`Stream ${this.store.remotePeerID} --> us`, 'has-text-success')
        this.$refs.audio.srcObject = stream
        this.$refs.audio.play()
      })
    }
  },
  mounted () {
    window.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement) {
        return
      }
      if (e.ctrlKey || e.altKey || e.key === 'Escape' || e.key === 'Tab' || e.key === 'ContextMenu') {
        return
      }
      // Don't handle ctrl/alt keypresses
      if (e.ctrlKey || e.altKey) {
        return
      }
      if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90))) {
        return
      }
      this.$refs.code.focus()
    })
  }
})
</script>
