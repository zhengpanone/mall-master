<script setup lang="ts">
import { ref } from 'vue'
import Foo from '@/components/foo'
import Coo from '@/components/Coo'
defineProps<{ msg: string }>()

const count = ref(0)
</script>
<template>
  <h1>{{ msg }}</h1>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
  </div>
  <Foo />
  <Coo msg="Hell TSX" />
</template>

<style scoped>

</style>
