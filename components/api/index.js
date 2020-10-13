import router from '@/router';
// import store from '../../store';

const store = require('../../store/index.js').default;
import axios from 'axios';
import iView from 'iview';
import Vue from 'vue'
let Base64 = require('js-base64').Base64;
import electron from 'electron';

Vue.use(iView);
Vue.use(electron);

let showNetworkErrorMessage = false

//白名单的请求不用加token
// const whiteList = ['/login','/refresh','notice/getByChannel','qrLoginCode','checkQrLoginStatus','/face-login']
const whiteList = ['/login','/refresh','notice/getByChannel','qrLoginCode','checkQrLoginStatus','banner/list']
var refreshTokenFlag = false;
//定义token提前刷新时间，单位（秒）
const tokenRefreshTime = 3600
const license = electron.remote.getGlobal("appSetting").LICENSE
// http request 拦截器
//设置请求拦截，统一设置jwttoken到头部
axios.interceptors.request.use(function (config) {

  let url = config.url
  if(whiteList.indexOf(url)>=0){
    config.headers.License = license
    // config.headers.Authorization = "";
    return config
  }else{
      let token = store.getters.loginUser.token
      let decodeToken = JSON.parse(Base64.decode(token.split('.')[1]));
      let exp = decodeToken.exp;
      // let _this=this;
      let currsetTime = parseInt(new Date().getTime() / 1000);
      let t = exp - currsetTime
      // console.log('t',t)
      if (exp - currsetTime < tokenRefreshTime) {//3600
        // headers.Authorization = 'Bearer ' + localStorage.getItem("token");
          if(!refreshTokenFlag){
            refreshTokenFlag = true
            axios.get('/refresh',{
              headers:{
                Authorization:'Bearer ' + token
              }
            }).then(res => {
              if (res.data.code == 200) {
                refreshTokenFlag = false
                let newToken = res.data.data.token
                store.dispatch("setLoginUserToken",newToken);
                electron.ipcRenderer.send("refresh-user-token", newToken);
              }
            })
          }
      }
      config.headers.Authorization = 'Bearer ' + token
      config.headers.License = license
      console.log('config.headers.License:',config.headers.License)
      // ;global.appSetting.LICENSE
      
  }
  return config
}, function (err) {
  return Promise.reject(err);
});
//设置响应拦截，进行错误提示
axios.interceptors.response.use(function (res) {
  // console.log('res',res)
  // console.log('code',res.data.code)
  if (res.data.code == 401) {
    iView.Message.warning(res.data.msg);
    store.dispatch("logout");
    electron.ipcRenderer.send("user-logout");
    router.push({
      path: '/'
    })
  }
  if (res.data.code == 500) {
    let msg = res.data.msg;
    let indexOfHostInfo = msg.indexOf(']');
    if(indexOfHostInfo>=0){
      msg = msg.substring(indexOfHostInfo+1)
    }
    iView.Message.warning(msg);
  }
  return res;
}, function (err) {  
  console.log(err,'err')
 if(!showNetworkErrorMessage){
    iView.Message.error({
        content:'网络异常，请检查网络连接！',
        duration: 5,
        onClose:()=>{
          showNetworkErrorMessage = false
        }
    })
    showNetworkErrorMessage = true
 }
  
  return Promise.reject(err);
});


// get 获取数据
export const _get = (req) => {
  console.log(req,'req')
  return axios.get(req.url, {
    params: req.data
  })
}

// post 增加
export const _post = (req) => {
  return axios({
    method: 'post',
    url: `/${req.url}`,
    data: req.data
  })
}

//patch 编辑数据put请求
export const _put = (req) => {
  return axios({
    method: 'put',
    url: `/${req.url}`,
    data: req.data
  })
}

//delete  删除
export const _delete = (req) => {
  return axios({
    method: 'delete',
    url: `/${req.url}`,
    data: req.data
  })
}