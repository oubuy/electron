<template>
  <div id="app">
    <!-- <keep-alive>
    <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/> -->
    <router-view></router-view>
   
  </div>
</template>

<script>
export default {
  name: "osntv",

};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
#app {
  background: #fff;
}
html,
body {
  background: rgba(0, 0, 0, 0) !important;
  overflow-y: hidden;
   font-size: 17px;
}

@media screen and (max-width: 1440px) {
  html {

    font-size: 15px;
  }
}

@media screen and (max-width: 1280px) {
   html {
    font-size: 14px;
  }
}

@media screen and (max-width: 800px) {
   html {
    font-size: 12px;
  }
}
</style>
