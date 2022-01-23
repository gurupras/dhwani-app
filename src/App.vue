<template>
<div>
  <div class="container">
    <div class="section">
      <router-view v-slot="{ Component }">
        <transition :enter-active-class="store.transitionActive" :leave-active-class="store.transitionLeave" :duration="8000">
          <component :is="Component" />
        </transition>
    </router-view>
    </div>
  </div>
</div>
</template>

<script>
/* global NATIVE_BACKEND_HOST, WEBUI */
import { defineComponent } from 'vue'

import { useStore } from '@/stores/main'

export default defineComponent({
  setup () {
    return {
      store: useStore()
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  beforeMount () {
    window.app = this
    if (!WEBUI) {
      const ws = new WebSocket(`ws://${NATIVE_BACKEND_HOST}/ws`)
      ws.addEventListener('open', () => {
        this.store.ws = ws
      })
    }
  },
  mounted () {
  }
})
</script>

<style lang="scss">
.wrapper {
  width: 100%;
  min-height: 1vh;
}

.in-right, .out-left {
  position: absolute;
  --animate-duration: 0.4s;
}

.in-right {
  --animate-delay: 0.2s;
}
</style>
