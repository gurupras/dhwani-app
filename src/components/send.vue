<template>
<div class="wrapper section">
  <button class="button is-link" @click="startStream">Start Streaming</button>
  <h4 class="subtitle is-size-4" v-if="id">Your ID is {{friendlyLocalPeerID}}</h4>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import chunk from 'lodash/chunk'
import DhwaniLocalBackend from '@/js/dhwani-local-backend'
import { useStore } from '@/stores/send'
import { useStore as useMainStore } from '@/stores/main'

export default defineComponent({
  setup () {
    const store = useStore()
    const mainStore = useMainStore()
    return {
      store,
      mainStore
    }
  },
  data () {
    return {
      started: false,
      localPeerID: ''
    }
  },
  computed: {
    friendlyLocalPeerID () {
      if (!this.localPeerID) {
        return undefined
      }
      const chunks = chunk(this.localPeerID, 3)
      return chunks.map(x => x.join('')).join(' ')
    }
  },
  methods: {
    async startStream () {
      this.localBackend = new DhwaniLocalBackend(this.mainStore.ws)
      this.localPeerID = await this.localBackend.startRTPServer()
    }
  },
  mounted () {

  }
})
</script>
