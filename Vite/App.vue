<template>
<div>
  <h1>count is {{count}}</h1>
  <button @click="count++">戳我</button>
  </div>
</template>

<script>
import {ref,computed} from 'vue'
export default {
  setup(){
    const count = ref(0)
    function add(){
      count.value++
    }
    const double = computed(()=>count.value*2)
    return {count,add,double}
  }
}
</script>