import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      ws: undefined,
      transitionActive: 'animate__animated animate__slideInRight in-right',
      transitionLeave: 'animate__animated animate__slideOutLeft out-left'
    }
  }
})
