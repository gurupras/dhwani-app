<template>
<div class="section wrapper">
  <h2 class="title is-size-2 has-text-centered">What would you like to do?</h2>
  <div class="columns">
    <div class="column is-two-thirds-desktop is-offset-2-desktop is-flex" style="justify-content: space-evenly;">
      <button class="button is-link" :disabled="!store.ws" @click="$router.push('/send')">Start Streaming Audio</button>
      <button class="button is-link" :disabled="!store.ws" @click="$router.push('/receive')">Connect to Stream</button>
    </div>
  </div>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import { useStore } from '@/stores/main'

export default defineComponent({
  setup () {
    const store = useStore()
    return {
      store
    }
  }
})
</script>
