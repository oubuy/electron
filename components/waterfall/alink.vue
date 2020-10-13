<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="less">

.alink{
}

</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template>
  <a class="alink" :href="to" target="_blank">
    <slot></slot>
  </a>
</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
//import XXX from './components/XXX'

export default {
  name: 'alink',
  props:['to'],
  data () {
    return {
      msg: 'this is from alink.vue'
    }
  },
  methods: {

  }
}
</script>
