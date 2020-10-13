import Vue from 'vue'
import axios from 'axios'
// import qs from 'qs'

import App from './App'
import router from './router'
import store from './store'

import iView from 'iview';
import 'iview/dist/styles/iview.css';
import './assets/local/font/iconfont.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import VueTouch from 'vue-touch'
import electron from 'electron';


import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

// Vue.use(Viewer);
// Viewer.setDefaults({
//   Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": false, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }

// });
import vueSwiper from 'vue-awesome-swiper' // 引入vue-awesome-swiper
import 'swiper/dist/css/swiper.css' // 引入样式


// import preview from 'vue-photo-preview'
// import 'vue-photo-preview/dist/skin.css'
// Vue.use(preview)


Vue.use(vueSwiper) // 使用插件

Vue.use(VueTouch, {name: 'v-touch'})

Vue.use(VueAwesomeSwiper) 

Vue.use(iView);



import './style/reset.less'
import './style/global.less'




if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.http = Vue.prototype.$http = axios

Vue.config.productionTip = false

//不要改这里，修改接口环境在src/main/config.js中配置const env = 'test'
const env = electron.remote.getGlobal('env')
// global.env = env
if(env=='test'){
  console.log('env:test')
  axios.defaults.baseURL = "http://edasapp.osnyun.com:8091/";
}else if(env=='prod'){
  console.log('env:prod')
  axios.defaults.baseURL = "http://padapi.oceano.com.cn/";
}else{  
  console.log('env:local')
  // axios.defaults.baseURL = "http://10.16.11.28:18094/";
   axios.defaults.baseURL = "http://10.16.11.23:18094/";
}



Vue.prototype.showSpin = function (timeout){
  this.$Spin.show({
      render: (h) => {
          return h('div', [
              h('i', {
                  'class': 'spin-icon-load ivu-icon ivu-icon-ios-loading',
                  'style': "font-size: 40px;color:#c59b5f"
              }),
              h('div', {'style': "font-size: 14px;color:#c59b5f"},'Loading...')
          ])
      }
  });
  if(timeout&&timeout>0){
    setTimeout(() => {
        this.$Spin.hide();
    }, timeout);
  }
}
Vue.prototype.hideSpin = function (timeout){
  if(timeout&&timeout>0){
    setTimeout(() => {
        this.$Spin.hide();
    }, timeout);
  }else{
    this.$Spin.hide();
  }
}



// console.log('fileServerPort:',fileServerPort)
//获取图片本地路径
Vue.prototype.getImgLocalUrl = function (imgUrl){
  const fileServerPort = electron.remote.getGlobal("fileServerPort");
  //修改图片地址为调用本地图片服务--开始
  // return imgUrl;
  return "http://localhost:"+fileServerPort +"/localFile?url=" + encodeURIComponent(imgUrl) + "&cT=image%2Fjpeg";
  //修改图片地址为调用本地图片服务--结束
}
//根据本地路径获取图片原路径
Vue.prototype.getImgLocalSourceUrl = function (imgUrl){
  //修改图片地址为调用本地图片服务--开始
  // return imgUrl;
  let start = imgUrl.indexOf("?url=")+5;
  if(start<0){
    return imgUrl
  }
  let end = imgUrl.indexOf("&cT=");
  if(end<0){
    return imgUrl
  }
  imgUrl = decodeURIComponent(imgUrl.substring(start,end))
  console.log('imgUrl:',imgUrl)
  return imgUrl;
  //修改图片地址为调用本地图片服务--结束
}


/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

