<script setup>
</script>
<template>
<span>
  <input v-for="(_, $index) in values" :key="$index" class="input" v-model="values[$index]" required maxlength="1" @keyup="onKeyUp" :ref="el => setInputRef(el, $index)"/>
</span>
</template>

<script>
import { ref } from 'vue'
export default {
  props: {
    numDigits: {
      type: Number,
      required: true
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      value: '',
      values: {},
      inputToIndex: new Map(),
      indexToInput: new Map()
    }
  },
  watch: {
    values: {
      handler (v) {
        const chars = []
        for (let idx = 0; idx < Object.keys(this.values).length; idx++) {
          chars.push(this.values[idx])
        }
        this.value = chars.join('')
      },
      deep: true
    },
    value () {
      this.$emit('update:modelValue', this.value)
    }
  },
  methods: {
    setInputRef (el, idxStr) {
      const idx = Number(idxStr)
      this.inputToIndex.set(el, idx)
      this.indexToInput.set(idx, el)
    },
    onKeyUp (e) {
      // Ignore Shift, Tab, CMD, Option, Control.
      if (e.ctrlKey || e.altKey || e.key === 'Escape' || e.key === 'Tab' || e.key === 'ContextMenu') {
        return
      }
      const index = this.inputToIndex.get(e.target)
      // On Backspace or Left arrow, go to previous input
      if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
        if (index !== 0) {
          // There is a previous input. Select that
          this.indexToInput.get(index - 1).select()
        }
        return
      }
      if (index === this.numDigits - 1) {
        // No next input.
        return
      }
      // Select the next input
      this.indexToInput.get(index + 1).select()
    },
    focus () {
      this.indexToInput.get(0).focus()
    }
  },
  beforeMount () {
    for (let idx = 0; idx < this.numDigits; idx++) {
      this.values[idx] = ref('')
    }
  },
  mounted () {
    window.code = this
  }
}
</script>

<style lang="scss" scoped>
input {
  display: inline-flex;
  height: 50px;
  margin-right: 0.5rem;
  text-align: center;
  font-size: 1.25rem;
  max-width: unset;
  width: 50px;
  min-width: 0;

  &:nth-child(3n+1) {
    margin-left: 1.5rem;
  }

  &:first-child {
    margin-left: 0;
  }
}
</style>
