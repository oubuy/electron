<template>
  <div>
    <div class="close_container" @click="close">
      <div class="close_button">关闭</div>  
    </div>
    <div class="back_container" @click="goBack" v-if="osnWebFlag">
      <div class="back_button">返回</div>  
    </div>
    <!-- <div class="debug_button" @click="openDevTools">DEBUG </div> -->
    <webview id="foo" class="webView" :style="wrapperStyle" :src="url"></webview>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      diyUrl: this.$electron.remote.getGlobal("diyUrl"),
      url: "",
      wrapperHeight: 0,
      osnWebFlag:false
    };
  },
  computed: {
    ...mapGetters("Favorites", ["figure720UrlData"]),
    wrapperStyle() {
      return "height:" + this.wrapperHeight + "px;";
    }
  },
  name: "web-page",
  created() {
    // console.log("Web Create");
    // console.log("type", this.$route.query.type);
    let fileServerPort = this.$electron.remote.getGlobal("fileServerPort");

    if (this.$route.query.type == 0) {
      // console.log("web00011000");
      let loginUser = this.$electron.remote.getGlobal("loginUser");
      // this.url = `http://www.oceano.com.cn/control/diy?id=${this.$route.query.sceneId}&tvUserId=&from=osntv`;
      //线上版本
      this.url = `http://www.oceano.com.cn/control/diy?spaceId=${
        this.$route.query.spaceId
      }&id=${this.$route.query.sceneId}&tvUserId=${
        loginUser.userId
      }&tvUersMobile=${loginUser.username}&from=osntv`;
      // this.url = `http://120.79.209.137/index.html?brand=web&spaceId=${this.$route.query.spaceId}&id=${this.$route.query.sceneId}&tvUserId=${loginUser.userId}&tvUersMobile=${loginUser.username}&from=osntv&localfile=true&fileServerPort=${fileServerPort}`;
      // `http://localhost:${global.fileServerPort}/diy/index.html?brand=webtest&localfile=true`

      //本地版本
      // let env = this.$electron.remote.getGlobal("env");
      // if(env=='prod'){
      //   //生产
      //   this.url = `http://localhost:${fileServerPort}/diy/index.html?brand=web&localfile=true&spaceId=${this.$route.query.spaceId}&id=${this.$route.query.sceneId}&tvUserId=${loginUser.userId}&tvUersMobile=${loginUser.username}&from=osntv&fileServerPort=${fileServerPort}`
      // }else{
      //   //测试
      //   this.url = `http://localhost:${fileServerPort}/diy/index.html?brand=webtest&localfile=true&spaceId=${this.$route.query.spaceId}&id=${this.$route.query.sceneId}&tvUserId=${loginUser.userId}&tvUersMobile=${loginUser.username}&from=osntv&fileServerPort=${fileServerPort}`
      // }
      // this.url = `${this.diyUrl}?brand=web&id=id6AD416635661BF157B134D24819A93&tvUserId=${loginUser.userId}&tvUersMobile=${loginUser.username}&from=osntv`
      // this.url = `${this.diyUrl}?brand=web&spaceId=${this.$route.query.spaceId}&id=${this.$route.query.sceneId}&tvUserId=${loginUser.userId}&tvUersMobile=${loginUser.username}&from=osntv`
      console.log("open diy url:", this.url);
    } else if (this.$route.query.type == 1) {
      // console.log(this.$route.query, "web720");
      // this.url = `http://vr.oceano.com.cn:6600/lib/krpano/krpano.html?xml=examples/mvtpano/krpano_vr2.xml&html5=only&catalog=${this.$route.query.panoramaImagePath}`;

      if (this.$route.query.figure720Type == "figure") {
        let figureUrl = localStorage.getItem("figureUrl");
        this.url = figureUrl;
      } else {
        this.url = `http://localhost:${fileServerPort}/720/index.html?brand=web&localfile=true&catalog=${
          this.$route.query.panoramaImagePath
        }&fileServerPort=${fileServerPort}&title=${encodeURIComponent(
          this.$route.query.spaceName
        )}`;
      }

      // http://localhost:6300/720/index.html?brand=web&localfile=false&catalog=build-web/dev/space/S0000001/vr
      // console.log(this.url, " this.url--web720");
    } else {
      // this.url = "https://about.oceano.com.cn/ltd/speech.html";
      let linkUrl = localStorage.getItem("bannerLinkUrl");
      if(linkUrl=='https://about.oceano.com.cn/ltd/speech.html'){
      this.osnWebFlag=true;
      }else{
         this.osnWebFlag=false;
      }
      this.url = linkUrl;
    }

    // const _this = this;
    // _this.$electron.ipcRenderer.on("webview-reload", (event, arg) => {
    //   if (arg.type == 0) {
    //     this.url = `http://www.oceano.com.cn/control/diy?id=${arg.sceneId}&userId=&from=ipad`;

    //   } else {
    //     this.url = `http://vr.oceano.com.cn:6600/lib/krpano/krpano.html?xml=examples/mvtpano/krpano_vr2.xml&html5=only&catalog=${arg.panoramaImagePath}`;
    //   }
    // console.log(this.url);
    //   const webview = document.querySelector('webview');
    //   webview.src = this.url;
    //   //  console.log('webView',arg);

    // });
  },
  mounted() {
    // console.log("Web mounted");
    this.wrapperHeight = document.documentElement.clientHeight;
    // const _this = this;
    // _this.$electron.ipcRenderer.on("webview-reload", (event, arg) => {
    //   if (arg.type == 0) {
    //     this.url = `http://www.oceano.com.cn/control/diy?id=${arg.sceneId}&userId=&from=ipad`;

    //   } else {
    //     this.url = `http://vr.oceano.com.cn:6600/lib/krpano/krpano.html?xml=examples/mvtpano/krpano_vr2.xml&html5=only&catalog=${arg.panoramaImagePath}`;
    //   }
    //   console.log(this.url);
    //   const webview = document.querySelector('webview');
    //   webview.src = this.url;
    // });
  },
  methods: {
    openDevTools() {
      this.$electron.ipcRenderer.send("open-web-DevTools");
    },
    min() {
      let mainWin = this.$electron.remote.getCurrentWindow();
      mainWin.minimize();
    },
    max() {
      let mainWin = this.$electron.remote.getCurrentWindow();
      if (mainWin.isFullScreen()) {
        mainWin.setFullScreen(false);
        this.isFullScreen = false;
      } else {
        mainWin.setFullScreen(true);
        this.isFullScreen = true;
      }
    },
    close() {
      localStorage.removeItem("figureUrl");
      localStorage.removeItem("bannerLinkUrl");
      let mainWin = this.$electron.remote.getCurrentWindow();
      mainWin.close();
    },
    goBack() {
      let webview = document.querySelector("webview");
      webview.goBack();
    }
  }
};

onload = () => {
  // const webview = document.querySelector('webview')
  // webview.src="http://www.oceano.com.cn/control/diy?id=sdb18bd25d9d045d9a41ed1775c37296b&userId=&from=ipad";
  // const indicator = document.querySelector('.indicator')
  // const loadstart = () => {
  //   indicator.innerText = 'loading...'
  // }
  // const loadstop = () => {
  //   indicator.innerText = ''
  // }
  // webview.addEventListener('did-start-loading', loadstart)
  // webview.addEventListener('did-stop-loading', loadstop)
};
</script>


<style lang="less">
.close_container {
  left: 10px;
  height: 50px;
  width: 80px;
  margin-top: 10px;
  margin-left: 10px;
  position: absolute;
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0.498039);
  border-radius: 9px;
  box-shadow: rgba(255, 255, 255, 0.247059) 0px 0px 7.2px;
  z-index: 99999999;
  .close_button {
    // margin: 6px 10px 6px 10px;
    position: absolute;
    right: 21px;
    top: 10px;
    cursor: pointer;
    color: #ffffff;
    font-size: 20px;
  }
}
.back_container {
  left: 120px;
  height: 50px;
  width: 80px;
  margin-top: 10px;

  position: absolute;
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0.498039);
  border-radius: 9px;
  box-shadow: rgba(255, 255, 255, 0.247059) 0px 0px 7.2px;
  z-index: 99999999;
  .back_button {
    position: absolute;
    right: 22px;

    top: 10px;
    cursor: pointer;
    color: #ffffff;
    font-size: 20px;
  }
}

.debug_button {
  // margin: 6px 10px 6px 10px;
  position: absolute;
  right: 51px;
  top: 10px;
  cursor: pointer;
  color: #ffffff;
  font-size: 20px;
}
.webView {
  display: inline-flex;
  width: 100%;
}
</style>