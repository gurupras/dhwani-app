import { defineStore } from 'pinia'

export const useStore = defineStore('send', {
  state: () => {
    return {
      remotePeerID: ''
    }
  }
})
