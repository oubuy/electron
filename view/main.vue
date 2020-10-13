<template>
  <div ref="webpageView">
     <v-touch @swiperight="swiperight" style="position:absolute;top:0;bottom:0; width:100%;">
    <div id="head_bar" class="head_container"  :class="headClass" style="text-align:center;">
      <div class="head_left">
        <div class="logo">
          <img src="~@/assets/local/images/logo.png">
        </div>
        <div class="left_font">{{loginUser.shopName}}</div>
      </div>
      <div class="head_right">
       <!-- <div class="comonStyle" @click="openDevTools">
          <div class="common_img"><img src="~@/assets/local/images/top_right_icon.png" alt=""></div>
          <div class="comon_font">打开调试</div>
        </div> -->
        <!-- <div class="comonStyle" @click="showSpin(3000)">
          <div class="common_img"><img src="~@/assets/local/images/top_right_icon.png" alt=""></div>
          <div class="comon_font">手写板</div>
        </div> -->
        <!-- <div class="comonStyle" @click="openHandInput">
          <div class="common_img"><img src="~@/assets/local/images/top_right_icon.png" alt=""></div>
          <div class="comon_font">手写板</div>
        </div> -->
        <!-- <div class="comonStyle" @click="openKeyboard">
          <div class="common_img"><img src="~@/assets/local/images/top_right_icon.png" alt=""></div>
          <div class="comon_font">软键盘</div>
        </div> -->
        <div class="comonStyle" @click="clean">
          <div class="common_img"><img src="~@/assets/local/images/top_right_icon.png" alt=""></div>
          <div class="comon_font">清空</div>
        </div>
        <div class="comonStyle" @click="favorites">
          <Badge :count="totalFavorites" type="warning">
            <div class="common_img"><img src="~@/assets/local/images/top_right_icon2.png" alt=""></div>
          </Badge>
            <div class="comon_font">收藏夹</div>
          </div>
          <router-link :to="{ path: '/main/scene', query: { autoDownload: false}}" tag="div" class="comonStyle secne_div">
           <div class="common_img"><img src="~@/assets/local/images/loading.png" alt=""></div>
            <div class="comon_font">场景下载</div>
            </router-link>
          <!-- <router-link :to="{ path: '/main/scene_w', query: { autoDownload: false}}" tag="div" class="comonStyle secne_div">
           <div class="common_img"><img src="~@/assets/local/images/loading.png" alt=""></div>
            <div class="comon_font">场景下载_w</div>
            </router-link> -->
          <!-- <router-link :to="{ path: '/main/case_w'}" tag="div" class="comonStyle secne_div">
           <div class="common_img"><img src="~@/assets/local/images/loading.png" alt=""></div>
            <div class="comon_font">效果图_w</div>
            </router-link> -->
          <Dropdown trigger="click">
            <div class="pic_head comonStyle">
              <div class="common_img name_avatar"><Avatar :src="loginUser.avatar" size="small"/></div>
              <div class="right_font comon_font name_real">{{loginUser.realName}}</div>
              
            </div>
          
            <DropdownMenu slot="list" :class="show_scroll?'drow_scroll':'drow_auto'">
              <DropdownItem v-for="employee in employeeListWithoutCurrentUser" :key="employee.username" >
                  <div @click="changeUser(employee.username)" style="width:100px;text-align:left">
                    <Avatar :src="employee.avatar" size="small" style="margin-left:10px;"/>
                    <span style="margin-left:10px">{{employee.realName}}</span>
                  </div>
              </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div class="comonStyle min" @click="min">
          <img src="~@/assets/min.png">
        </div>
        <div class="comonStyle min" @click="max">
          <img src="~@/assets/back.png">
        </div>        
        <div class="comonStyle min" @click="close">
           <img src="~@/assets/rest.png">
        </div>
        <!-- <div class="comonStyle" @click="checkUpdate">测试检查更新</div>
        <div class="comonStyle" @click="checkLicense">测试激活</div>
        <div class="comonStyle" @click="syncScene">场景同步</div> -->
        <!-- <div @click="min" class="right_min" style="-webkit-app-region: no-drag">
          <img src="~@/assets/min.png">
        </div> -->
      </div>
    </div>
    <div>
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"/>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"/>
      
    </div>
    <!-- 用户弹出登录窗口 -->
   <Modal v-model="login.showLoginWin" footer-hide :mask-closable="false" width="400" :closable="false" class-name="vertical-center-modal">
       <div>
		   <div class="nav_bar">
			   <div :class="activedIndex==0?'nav_bar_actived':''" @click="loginByPsw">账号登录</div>
			   <div :class="activedIndex==1?'nav_bar_actived':''" @click="loginByCode">扫码登录</div>
		   </div>
		   <!-- <p slot="header" style="font-size:18px;text-align:center">
		      <span>欢迎登录</span>
		    </p> -->
		     <div v-show="activedIndex==0">
		      <div class="logo_main">
		        <div class="logo_name" style="position: relative;">
		          <!-- 账号： -->
		          <input type="text" id="accountInput" placeholder="请输入您的企信账号" @focus="handleAccountKb" v-model="account.username" style="width: 340px;padding: 14px 32px;border-radius: 4px;border: 1px solid #c59b5f;font-size: 16px;color: #515a6e;">
		   			  <Icon type="ios-contact" style="position:absolute;width: 32px;font-size:21px;height: 36px;line-height:36px;color:#808695;z-index: 1;left: 0;top: 0;text-align: center;height: 100%;display: flex;align-items: center;justify-content: center;"></Icon>
		   			  <Icon type="ios-keypad" style="position:absolute;width: 32px;font-size:21px;height: 36px;line-height:36px;color:#808695;cursor: pointer;top: 0;right: 0;text-align: center;height: 100%;display: flex;align-items: center;justify-content: center;" @click="showKeyboard"></Icon>
		            <!-- <Input ref="account" prefix="ios-contact" size="large" placeholder="请输入您的企信账号" icon="ios-keypad" @on-click="openKeyboard('account')" v-model="account.username"/> -->
		        </div>
		   			<div id="softkeyAcc" style="position: absolute;z-index: 10000;top: 260px;left: 50%;margin-left: -467px;"></div>
		        <div class="logo_psw" style="position: relative;">
		          <!-- 密码： -->
		          <!-- <input type="password" placeholder="请输入企信密码" v-model="account.password"> -->
		   			   <input type="password" id="password_input" placeholder="请输入您的企信密码" @focus="handlePswKb" v-model="account.password" style="width: 340px;padding: 14px 32px;border-radius: 4px;border: 1px solid #c59b5f;font-size: 16px;color: #515a6e;">
		   			   <Icon type="ios-lock" style="position:absolute;width: 32px;font-size:21px;height: 36px;line-height:36px;color:#808695;z-index: 1;left: 0;top: 0;text-align: center;height: 100%;display: flex;align-items: center;justify-content: center;"></Icon>
		   			   <Icon type="ios-keypad" style="position:absolute;width: 32px;font-size:21px;height: 36px;line-height:36px;color:#808695;cursor: pointer;top: 0;right: 0;text-align: center;height: 100%;display: flex;align-items: center;justify-content: center;" @click="showPswKeyboard"></Icon>
		           <!-- <Input type="password" size="large" prefix="ios-lock" clearable placeholder="请输入您的企信密码" v-model="account.password" /> -->
		        </div>
		        <div class="logo_regin">
		          <!-- <button @click="login">登录</button> -->
		           <Button class="footer_bottun login_button" size="large" @click="doLogin">登录</Button>
		      
		        </div>
		        <div class="logo_warn" v-show="login.msgFlag">
		          <div class="logon_warn_text">
		            <img src="~@/assets/warn.png" alt>
		            {{login.msg}}
		          </div>
		        </div>
		      </div>
		     </div>
			 <div v-show="activedIndex==1">
				 <div class="code_box" v-if="!loginFail"><VueQr :margin="0" :size='180' :dotScale="1" :text='config.text'></VueQr></div>
				 <div class="fail_box" v-else>
					 <div style="padding: 45px 0;font-size: 16px;">登录失败，请刷新二维码后登录</div>
					 <Button @click="handleGetQrLoginCode">刷新二维码</Button>
				 </div>
				 <div style="text-align: center;font-size: 16px;">请打开企信，扫一扫二维码</div>
			 </div>
	   </div>
         <div slot="footer">
        </div>
        <div class="close_button" @click="close"><img src="~@/assets/local/images/close1.png" alt=""></div>
    </Modal>
    <!-- 公告 -->
     <Modal footer-hide :mask-closable="false" width="650" :closable="false" class-name="vertical-center-modal etc_box"
        v-model="notice_flag"
       
       >
       <div class="notice_img_box"><img class="notice_img" src="~@/assets/local/images/notice.jpg"></div>
       <div class="notic_content_box">
         <p class="ect_title">{{notice_head}}</p>
         <div class="ect_content"><pre>{{notice_content}}</pre></div>
          <div class="etc_time">{{notice_time}}</div>
      </div>
      
       <div class="etc_button" @click="handleNoticeClose">关闭</div>
      
    </Modal>

        <!-- 客户端激活窗口 -->
   <Modal v-model="license.showLicenseWin" footer-hide :mask-closable="false" :closable="false" width="400" class-name="vertical-center-modal">
       <p slot="header" style="font-size:18px;text-align:center">
          <span>激活码</span>
        </p>
         <div>
          <div class="lincen_main">
            <div class="lincen_name">
              <!-- 账号： -->
                <Input ref="license" size="large" prefix="ios-key" placeholder="请输入激活码" icon="ios-keypad" @on-click="openKeyboard('license')" v-model="license.value"/>
                <!-- <input ref="license" type="text" placeholder="请输入激活码" v-model="license.value" icon="ios-keypad" @on-click="openKeyboard('license')" class="licen_input"> -->
                <!-- <img src="~@/assets/local/images/code.png" alt="" class="licen_img"> -->
                <div class="lincen_warn" v-show="license.showLicenseMsg">
                  <div class="lincen_warn_text">                  
                    {{license.licenseMsg}}
                </div>
            </div>
            </div>
            <div class="lincen_regin">
              <!-- <button @click="login">登录</button> -->
               <Button class="lincen_bottun" @click="submitLicense">激活</Button>
               <Button class="lincen_bottun color_fff" @click="cancelSubmitLicense">取消</Button>
            </div>
           
          </div>
         </div>
         <div slot="footer">
        </div>
    </Modal>

    <!-- 提醒下载场景窗口 -->
    <Modal v-model="scene.showDownloadWin" footer-hide :mask-closable="false" width="610" class-name="vertical-center-modal">
      
       <div>
          <div>
            <div class="read_title">
              <span>检测到您还有<span class="last_span">{{scene.readToDownloadNum}}</span>个VR场景尚未下载，是否启动下载？</span>
            </div>
            <div class="read_down">              
               <Button class="read_button" @click="gotoDownloadScenes">下载</Button>
               <Button class="read_button read_color" @click="cancelGotoDownloadScenes">取消</Button>
            </div>
          </div>
      </div>
        
    </Modal>

    <Modal v-model="update.showUpdateTips2" footer-hide :mask-closable="false" :closable="false" width="610" class-name="vertical-center-modal">
       <div>
          <div>
            <div class="read_title">
              <span>更新包已就绪，请更新后继续使用！</span>
            </div>
            <div style="text-align:center">              
               <Button class="read_button" type="primary" size="large" @click="updateNow">立即更新</Button>
            </div>
          </div>
      </div>
    </Modal>
    <div class="update_button" v-show="update.showUpdateTips">
      <span>{{update.tips}}</span>
      <span v-show="update.showUpdateButton">
          <button @click="updateNow">立即更新</button>=
        <button @click="hideUpdateTips">稍后更新</button>
      </span>
    </div>
    <!-- <div class="update_button" >
      <span>提示</span>
      <span>
         <button @click="updateNow">立即更新</button>
        <button @click="hideUpdateTips">稍后更新</button>
      </span>
    </div> -->
     </v-touch>
    
  </div>
</template>

<script>
const path = require("path");
import $ from "jquery";
// import { mapGetters } from "vuex";
import VueQr from 'vue-qr';
import NavMenu from "../components/nav_menu";
import Utils from "../assets/js/util.js";
import { mapGetters, mapActions } from "vuex";
import {
  userLogin,
  changeUserLogin,
  activateLicense,
  checkLicense,
  salesmen,
  logLicense,
  logColse,
  noticeChannel,
  getQrLoginCode,
  checkLoginStatus,

} from "../components/api/main.js";
import {
  findAllLocalFavorites,
  cleanupFavorites
} from "../components/api/favorites.js";

export default {
  name: "main-page",
  data() {
    return {
	  activedIndex: 0,
      notice_head: "",
      notice_content: "",
      notice_time: "",
      notice_flag: false,
      show_scroll: false,
      headClass: "height_three",
      showLoginWin: false,
      account: {
        username: localStorage.getItem("lastUsername"),
        password: localStorage.getItem("lastPassword")
      },
      scene: {
        showDownloadWin: false,

        readToDownloadNum: 0
      },
      login: {
        showLoginWin: false,
        msg: "",
        msgFlag: false
      },
      license: {
        showLicenseWin: false,

        value: "",
        // licenseMsg: "",
        licenseMsg: "dfadsfasfawe",
        showLicenseMsg: false,
        mac: ""
      },
      update: {
        tips: "",
        force:false,
        showUpdateTips: false,
        showUpdateButton: false,
        showUpdateTips2: false
      },
      isFullScreen: true,
      employeeList: [],
	  showKb: false,
	  showPswKb: false,
	  loginUrl: '',
	  loginCode: '',
	  config: {
	    text: "",//必须写text属性
	  },
	  timeId: null,
	  loginFail: false
    };
  },
  components: { NavMenu,VueQr },
  computed: {
    loginUser() {
      let loginUser = this.$store.getters.loginUser;
      if (!loginUser.token) {
        // this.login.showLoginWin = true;
      }
      return loginUser;
    },
    employeeListWithoutCurrentUser() {
      let currentUser = this.$store.getters.loginUser.username;
      return this.employeeList.filter(e => {
        return e.username != currentUser;
      });
    },
    ...mapGetters("Favorites", ["totalFavorites"])
  },
  mounted() {
    // console.log(1111)
    
    this.handleGetNotice();

  },
  created() {

    // this.checkUserLogin();
	this.virtualKeyboard = VirtualKeyboard;
    this.initHotUpdate();
    this.initCheckLicense();
    this.initFindDownloadedScenes();
	
    this.$electron.ipcRenderer.on("app-warning", this.warning);
    this.$electron.ipcRenderer.on("open-ue4-err", this.openUe4Err);
    this.$electron.ipcRenderer.on("open-ue4-successed", this.openUe4Successed);
  },
  methods: {
 
	loginByPsw() {
		this.activedIndex = 0;
	},
	loginByCode() {
		this.activedIndex = 1;
		this.handleGetQrLoginCode();
	},
	handleGetQrLoginCode() {
		this.loginFail = false;
	  getQrLoginCode().then(res=>{
		  
		  if(res.data.code==200) {
			  this.loginUrl = res.data.data.loginUrl;
			  this.loginCode = res.data.data.loginCode;
			  this.config.text = this.loginUrl;
			  this.checkLoginStatus();
		  }
	  })
	},
	checkLoginStatus() {
		if(this.timerId) clearTimeout(this.timerId);
		if(this.activedIndex==0) return;
		checkLoginStatus({loginCode: this.loginCode}).then(res=>{
			if(res.data.code==200) {
				let status = res.data.data.loginStatus.status;
				let token = res.data.data.loginStatus.token;
				if(status=="expired") {
					this.handleGetQrLoginCode();
				}else if(status=="scaned") {
					if(!token) {
						console.log("登录失败!!");
						this.loginFail = true;
						// this.handleGetQrLoginCode();
					}else {
						let userInfo = res.data.data.userInfo;
						let loginUser = {
						  token: token,
						  orgName: userInfo.orgName,
						  comName: userInfo.comName,
						  shopName: userInfo.shopName
						    ? userInfo.shopName
						    : userInfo.comName,
						  realName: userInfo.realName,
						  username: userInfo.username,
						  userId: userInfo.userId,
						  orgId: userInfo.orgId,
						  comId: userInfo.comId,
						  cityCode: userInfo.cityCode,
						  cityName: userInfo.cityName,
						  avatar: userInfo.avatar,
						};
						this.$store.dispatch("setLoginUser", loginUser);
						this.login.showLoginWin = false;
						//通知主进程用户登录成功
						this.$electron.ipcRenderer.send("user-login-success", loginUser);
						localStorage.setItem("lastUsername", userInfo.username);
						localStorage.setItem("currentUsername", userInfo.username);
						localStorage.setItem("currentUsernameUserId", userInfo.userId);
						this.checkLicense();
						this.loadSalesmen();
						this.initFavorites();
						this.checkUpdate();
					}
				}else if(status=="created") {
					this.timerId = setTimeout(this.checkLoginStatus, 2000);
				}
				
			}			  
		})
	},
	showKeyboard(){
	  this.showPswKb = false;
	  this.hidePswKeyboard();
	  this.showKb = !this.showKb;
	  if(this.showKb) {
		  
	  	this.virtualKeyboard.toggle('#accountInput', 'softkeyAcc');
		
	  }else {
	  	this.hideKeyboard();
	  }
	},
	showPswKeyboard() {
		this.showKb = false;
		this.hideKeyboard();
		this.showPswKb = !this.showPswKb;
		if(this.showPswKb) {
			this.virtualKeyboard.toggle('#password_input', 'softkeyAcc');
		}else {
			this.hidePswKeyboard();
		}
	},
	hideKeyboard() {
	  this.virtualKeyboard.toggle('accountInput','softkeyAcc');
	},
	hidePswKeyboard() {
		this.virtualKeyboard.toggle('password_input','softkeyAcc');
	},
	handleAccountKb() {
		if(this.showPswKb) {
			this.showKb = false;
			this.showKeyboard();
		}
	},
	handlePswKb() {
		if(this.showKb) {
			this.showPswKb = false;
			this.showPswKeyboard();
		}
	},
    handleGetNotice() {
      noticeChannel({ channel: "交互大屏" }).then(res => {
        if (res.data.code === 200) {
          if (res.data.data!=null) {
            this.notice_flag = true;
            this.notice_content = res.data.data.content;
            this.notice_head = res.data.data.name;
            let d_time = new Date(res.data.data.beginDate);
            this.notice_time = this.formatDate(d_time);
          }else{
            this.login.showLoginWin=true;
          }
        }
      });
    },
    handleNoticeClose() {
      this.notice_flag = false;
      this.checkUserLogin();

      // this.checkLicense(); //激活码
    },
    formatDate(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      return year + "-" + month + "-" + date;
    },
    logLicense(param) {
      logLicense(param).then(res => {
        if (res.data.code === 200) {
          localStorage.setItem("logLicenseInfo", "YES");
        }
      });
    },
    openDevTools() {
      this.$electron.ipcRenderer.send("open-DevTools");
    },
    openHandInput() {
      this.$electron.ipcRenderer.send("open-HandInput");
    },
    openKeyboard(taget) {
      this.$electron.ipcRenderer.send("open-sys-keyboard");
      this.$refs[taget].focus();
    },
    openUe4Err(event, params) {
      this.$Message.warning(params);
    },
    openUe4Successed(event, params) {
      // this.$Spin.show();
      // setTimeout(() => {
      //     this.$Spin.hide();
      // }, 10000);
      // this.handleSpinCustom(10000)
      this.showSpin(10000);
    },
    warning(event, msg) {
      this.$Spin.hide();
      this.$Message.warning(msg);
    },
    clean() {
      //Todo:清空收藏夹
      console.log("清空收藏夹");
      this.cleanFavorites({ mac: this.$electron.remote.getGlobal("mac") });
    },
    favorites() {
      //Todo:收藏夹
      this.$router.push({
        path: "/main/favorites"
      });
    },
    setting() {
      //Todo:设置
      console.log("设置");
    },
    dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    },
    initCheckLicense() {
      this.$electron.ipcRenderer.on("input-license", (event, mac) => {
        console.log("mac:"+mac);
        this.license.mac = mac;
        this.license.licenseMsg = "激活码仅能使用一次，请谨慎使用";
        this.license.showLicenseMsg = true;
        this.license.showLicenseWin = true;
      });

      this.$electron.ipcRenderer.on("check-license-remote", (event, arg) => {
        this.license.value = arg.license;

        console.log("check-license-remote mac:"+arg.mac);
        if(arg.mac===undefined || arg.mac===''){
          this.license.licenseMsg = "获取机器码失败，请重启软件";
          this.license.showLicenseMsg = true;
          this.license.showLicenseWin = true;
          return;
        }
        this.license.mac = arg.mac;

        this.$electron.ipcRenderer.send("save-mac", arg.mac);
        
        checkLicense(arg)
          .then(res => {
            this.$Notice.config({
              // top: window.screen.height - 120,
              top: 150,
              duration:0
            })
            console.log('check-license res:',res)
            let data= res.data.data;
            if(data.showNotice){
              this.$Notice.warning({
                title:'激活码到期提醒',
                desc:res.data.msg,
                duration:0
              });
            }

            if(!data.canUse){
              console.log("license异常");
              this.license.licenseMsg = res.data.msg;
              this.license.showLicenseMsg = true;
              this.license.showLicenseWin = true;
            }
            
            this.logLicense({
              license: arg.license,
              info: this.$electron.remote.getGlobal("diskSerialnumber")
            });
            //同步场景数据
            this.syncScene();
            
            // let c = 60*60*24*1000*5;
            // let curTimestamp = new Date().getTime();
            // if(res.data.code === 200){
            //   let endTimestamp = res.data.data;
            //   if(endTimestamp>0){
            //     console.log('存在到期时间，判断是否需要提醒快到期')
            //     console.log('endTimestamp:',endTimestamp)
            //     console.log('curTimestamp:',curTimestamp)
            //     let d = endTimestamp - curTimestamp;
            //     if(d>c){
            //       console.log('还没到期，并且5天后还没到期')
            //     }else if(d<=c&&d>=0){
            //       console.log('还没到期，但在5天内到期')
            //       // this.$Message.warning({
            //       //   content:'还没到期，但在5天内到期',
            //       //   duration:0
            //       // });
            //       this.$Notice.warning({
            //         title:'激活码到期提醒',
            //         desc:'激活码将于'+ this.dateFormat("YYYY-mm-dd", new Date(endTimestamp)) +'到期，为了不影响你的正常使用，请及时续费！',
            //         duration:0
            //       });
            //     }
            //     // else if(d<=0&&(d+c)>=0){
            //     //   console.log('已到期，但未超过5天内')
            //     //   this.$Message.warning('已到期，但未超过5天内');

            //     // }else if(d<=0&&(d+c)<=0){
            //     //   this.$Message.warning('已到期，并且超过5天内');

            //     // }
            //   }
              
            //   this.logLicense({
            //     license: arg.license,
            //     info: this.$electron.remote.getGlobal("diskSerialnumber")
            //   });
            //   this.syncScene();
            // }else{
            //   let endTimestamp = res.data.data;
            //   if(endTimestamp){
            //     console.log('存在到期时间，判断是否需要提醒快到期')
            //     console.log('endTimestamp:',endTimestamp)
            //     console.log('curTimestamp:',curTimestamp)
            //     let d = endTimestamp - curTimestamp;
            //     if(d<=0&&(d+c)>=0){
            //       console.log('已到期，但未超过5天内')
            //       // this.$Message.warning({
            //       //   content:'已到期，但未超过5天内',
            //       //   duration:0
            //       // });
            //       this.$Notice.warning({
            //         title:'激活码到期提醒',
            //         desc:'激活码已于'+ this.dateFormat("YYYY-mm-dd", new Date(endTimestamp)) +'到期，为了不影响你的正常使用，请在' + this.dateFormat("YYYY-mm-dd", new Date(endTimestamp+c)) + '前完成续费！',
            //         duration:0
            //       });

            //     }else if(d<=0&&(d+c)<=0){
            //       // this.$Message.warning('已到期，并且超过5天内',0);
            //       this.$Notice.warning({
            //         title:'激活码到期提醒',
            //         desc:'激活码已于'+ this.dateFormat("YYYY-mm-dd", new Date(endTimestamp)) +'到期，请续费后继续使用！',
            //         duration:0
            //       });
                  
            //       console.log("license异常");
            //       this.license.licenseMsg = res.data.msg;
            //       this.license.showLicenseMsg = true;
            //       this.license.showLicenseWin = true;

            //     }
            //   }

            // }

            // if (res.data.code === 200) {
            //   if (!res.data.data) {
            //     console.log("license无效（与本机不匹配，或已失效）");
            //     this.license.licenseMsg = "无效激活码";
            //     this.license.showLicenseMsg = true;
            //     this.license.showLicenseWin = true;
            //   } else {
            //     console.log("license有效");

            //     /**提交采集硬件唯一码信息 */
            //     // let logLicenseInfo = localStorage.getItem("logLicenseInfo")
            //     // if(logLicenseInfo!='YES'){
            //     this.logLicense({
            //       license: arg.license,
            //       info: this.$electron.remote.getGlobal("diskSerialnumber")
            //     });
            //     // }

            //     //检测license通过后同步场景信息
            //     this.syncScene();
            //   }
            // } else {
            //   console.log("license异常");
            //   this.license.licenseMsg = "激活码异常，请重新激活";
            //   this.license.showLicenseMsg = true;
            //   this.license.showLicenseWin = true;
            // }
          })
          .catch(err => {
            console.log("err:", err);
          });
      });
    },
    submitLicense() {
      if (!this.license.value) {
        this.license.licenseMsg = "请输入激活码";
        this.license.showLicenseMsg = true;
        return;
      }

      if(this.license.mac===undefined || this.license.mac===''){
        this.license.licenseMsg = "获取机器码失败，请重启软件";
        this.license.showLicenseMsg = true;
        return;
      }

      this.$electron.ipcRenderer.send("save-mac", this.license.mac);

      let param = { license: this.license.value, mac: this.license.mac };
      activateLicense(param)
        .then(res => {
          if (res.data.code === 200) {
            this.$electron.ipcRenderer.send("save-license", this.license.value);
            this.license.showLicenseWin = false;
            this.license.showLicenseMsg = false;

            // this.alertShow=true;
            //检测license通过后同步场景信息
            this.syncScene();
          } else {
            let msg = res.data.msg;
            let indexOfHostInfo = msg.indexOf("]");
            if (indexOfHostInfo >= 0) {
              msg = msg.substring(indexOfHostInfo + 1);
            }
            this.license.licenseMsg = msg;
            this.license.showLicenseMsg = true;
          }
        })
        .catch(err => {
          console.log("err:", err);
          this.license.licenseMsg = "网络连接出现异常";
          this.license.showLicenseMsg = true;
        });
    },
    cancelSubmitLicense() {
      this.close();
    },
    initHotUpdate() {
      this.$electron.ipcRenderer.on(
        "update-download-progress",
        (event, state) => {
          this.update.tips =
            "正在下载新版本：" +
            Math.floor(state.percent * 100) +
            "%，剩余时间：" +
            Math.floor(state.time.remaining) +
            "秒";
        }
      );
      this.$electron.ipcRenderer.on("update-available", (event, last) => {
        this.update.tips = "检查到更新版本" + last.version;
        this.update.showUpdateTips = true;
        this.update.force = last.force;
      });

      this.$electron.ipcRenderer.on("update-downloaded", event => {
        this.update.tips = "更新包已就绪，为确保您的正常使用，请马上更新！";
        if(this.update.force){
          this.update.showUpdateTips2 = true;
          this.update.showUpdateTips = false;
        }else{
          this.update.showUpdateTips = true;
          this.update.showUpdateButton = true;
        }
      });

      this.$electron.ipcRenderer.on("update-msg", (event, msg) => {
        this.update.showUpdateTips = true;
        this.update.tips = msg;
        setTimeout(() => {
          this.update.showUpdateTips = false;
        }, 5000);
      });
    },
    checkUserLogin() {
      let loginUser = this.$store.getters.loginUser;

      if (!loginUser.token) {
        this.login.showLoginWin = true;
      }
    },
    doLogin() {
     

      this.alertShow = true;
      this.login.msgFlag = false;
	  this.account.username = $("#accountInput").val();
	  this.account.password = $("#password_input").val();
      if (this.account.username && this.account.password) {
		this.showKb = false;
		this.showPswKb = false;
		this.hideKeyboard();
		this.hidePswKeyboard();
        userLogin(this.account)
          .then(res => {
            if (res.data.code === 200) {
				this.virtualKeyboard.switchLayout("CN Chinese Simpl. Pinyin");
              let userData = res.data.data;
            
              let loginUser = {
                orgName: userData.orgName,
                comName: userData.comName,
                shopName: userData.shopName
                  ? userData.shopName
                  : userData.comName,
                realName: userData.realName,
                username: userData.username,
                userId: userData.userId,
                orgId: userData.orgId,
                comId: userData.comId,
                cityCode: userData.cityCode,
                cityName: userData.cityName,
                avatar: userData.avatar,
                token: userData.token
              };

              this.$store.dispatch("setLoginUser", loginUser);
              // localStorage.setItem("token", userData.token);
              this.login.showLoginWin = false;
              //通知主进程用户登录成功
              this.$electron.ipcRenderer.send("user-login-success", loginUser);
              localStorage.setItem("lastUsername", this.account.username);
              localStorage.setItem("lastPassword", this.account.password);
              localStorage.setItem("currentUsername", this.account.username);
              localStorage.setItem("currentUsernameUserId", userData.userId);
              this.checkLicense();
              this.loadSalesmen();
              // this.syncScene();
              this.initFavorites();
              this.checkUpdate();
            } else {
              // _this.msg = "密码错误或账号不存在";
              this.login.msg = res.data.msg;
              this.login.msgFlag = true;
            }
          })
          .catch(e => {
            console.log(e);
            this.login.msg = "连接服务器出现错误，登录失败";
            this.login.msgFlag = true;
          });
      } else {
        if (!this.account.username && this.account.password) {
          this.login.msg = "请输入账号";
          this.login.msgFlag = true;
        } else if (!this.account.password && this.account.username) {
          this.login.msg = "请输入密码";
          this.login.msgFlag = true;
        } else if (!this.account.username && !this.account.password) {
          this.login.msg = "请输入账号和密码";
          this.login.msgFlag = true;
        }
      }
    },
    
    changeUser(username) {
      console.log("changeUser", username)
      changeUserLogin({ username: username })
        .then(res => {
          if (res.data.code === 200) {
            let userData = res.data.data;
            let loginUser = {
              orgName: userData.orgName,
              comName: userData.comName,
              shopName: userData.shopName
                ? userData.shopName
                : userData.comName,
              realName: userData.realName,
              username: userData.username,
              userId: userData.userId,
              orgId: userData.orgId,
              comId: userData.comId,
              cityCode: userData.cityCode,
              cityName: userData.cityName,
              avatar: userData.avatar,
              token: userData.token
            };
            localStorage.setItem("currentUsername", this.account.username);
            localStorage.setItem("currentUsernameUserId", userData.userId);
            this.$store.dispatch("setLoginUser", loginUser);
            // localStorage.setItem("token", userData.token);
            // this.login.showLoginWin = false;
            //通知主进程用户登录成功
            this.$electron.ipcRenderer.send("user-login-success", loginUser);
            // localStorage.setItem("lastUsername", this.account.username);
            // localStorage.setItem("lastPassword", this.account.password);
            this.cleanLocal();
            this.initFavorites();
          } else {
            // _this.msg = "密码错误或账号不存在";
            this.login.msg = res.data.msg;
            this.login.msgFlag = true;
            this.login.showLoginWin = true;
          }
        })
        .catch(e => {
          console.log(e);
          this.login.msg = "切换用户时出现异常";
          this.login.msgFlag = true;
          this.login.showLoginWin = true;
        });
    },
    loadSalesmen() {
      salesmen({}).then(res => {
        if (res.data.code === 200) {
          this.employeeList = res.data.data;
          if (this.employeeList.length != 0 && this.employeeList.length > 10) {
            this.show_scroll = true;
          } else {
            this.show_scroll = false;
          }
        }
      });
    },
    gotoDownloadScenes() {
      this.scene.showDownloadWin = false;
      this.$router.push({
        path: "/main/scene",
        query: {
          autoDownload: true
        }
      });
      console.log("goToDownloadScenes");
    },
    cancelGotoDownloadScenes() {
      console.log("cancelGoToDownloadScenes");
      this.scene.showDownloadWin = false;
    },
    redayToDownloadScenes(event, scenes) {
      console.log(
        `检测到您还有${scenes.length}个VR场景尚未下载，是否启动下载？`
      );

      if (
        scenes.length > 0 &&
        this.$electron.remote.getGlobal("arch") == "64-bit"
      ) {
        this.scene.readToDownloadNum = scenes.length;
        this.scene.showDownloadWin = true;
      }
    },
    syncScene() {
      console.log("检查同步场景数据");
      this.$electron.ipcRenderer.send("sync-scene");
    },
    initFavorites() {

      findAllLocalFavorites({
        mac: this.$electron.remote.getGlobal("mac")
      }).then(res => {
        if (res.data.code == 200) {
          let favorites = res.data.data;
          console.log("初始化favorites:", favorites);
          favorites.forEach(f => {
            if (f.entityType == "modity") {
              this.initProduct(f);
            } else if (f.entityType == "space") {
              this.initSpace(f);
            }else if (f.entityType == "space_sjt") {
              this.initFigure(f);
            }
            
          });
        }
      });
    },
    ...mapActions("Favorites", {
      cleanFavorites: "clean",
      initProduct: "initProduct",
      initSpace: "initSpace",
      initFigure:'initFigure',
      cleanLocal: "cleanLocal"
    }),
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
      // logColse().then(res => {
      //       console.log("res:", res);
      // }).catch(err => {
      //       console.log("err:", err);
      // });
      this.$electron.ipcRenderer.send("app-closed");
    },
    checkUpdate() {
      console.log("检测更新");
      this.$electron.ipcRenderer.send("checkForUpdate");
    },
    checkLicense() {
      console.log("检测license");
      this.$electron.ipcRenderer.send("check-license-existed");
    },
    hideUpdateTips() {
      this.update.showUpdateTips = false;
    },
    updateNow() {
      console.log("立即更新");
      this.$electron.ipcRenderer.send("applyUpdate");
    },
    handleTest() {
      console.log("触发关闭按钮");
    },
    swiperight() {
      console.log("back", this.$route.path);
      if (
        this.$route.path != "/main/product" &&
        this.$route.path != "/main/case" &&
        this.$route.path != "/main/change_brick" &&
        this.$route.path != "/main/home" &&
        this.$route.path != "/main/model" &&
        this.$route.path != "/main/product_info" &&
        this.$route.path != "/main/case_info"&&
         this.$route.path != "/main/figure"
      ) {
        this.$router.go(-1);
      }
    },
    initFindDownloadedScenes() {
      this.$electron.ipcRenderer.on("find-downloaded-scenes-reply", (event, scenes) => {
          this.$store.dispatch("setDownloadedScenes", scenes);
      });
      this.$electron.ipcRenderer.send("find-downloaded-scenes");
    }

    // ,
    // handleSpinCustom (timeout) {
    //     this.$Spin.show({
    //         render: (h) => {
    //             return h('div', [
    //                 h('i', {
    //                     'class': 'spin-icon-load ivu-icon ivu-icon-ios-loading',
    //                     'style': "font-size: 40px;color:#c59b5f"
    //                 }),
    //                 h('div', {'style': "font-size: 14px;color:#c59b5f"},'Loading...')
    //             ])
    //         }
    //     });
    //     if(timeout&&timeout>0){
    //       setTimeout(() => {
    //           this.$Spin.hide();
    //       }, timeout);
    //     }
    // }
  },
  watch: {
    $route(to, from) {
      console.log("to.path:", to.path);
      let local_path = to.path;
      if (local_path.indexOf("home") >= 0) {
        console.log("height_five");
        this.headClass = "height_five";
      } else {
        console.log("height_three");
        this.headClass = "height_three";
      }
    },
	'login.showLoginWin': {
		handler: function(newVal) {
			if(newVal) {
				this.virtualKeyboard.switchLayout("US US");
			}
		},
	}
  }
};
</script>

<style>
/* .spin-icon-load{
        animation: ani-spin 1s linear infinite;
    }
    @keyframes ani-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    } */
</style>


<style lang="less">
.nav_bar{
  display: flex;
  padding: 30px 0;
  font-size: 18px;
}
.nav_bar div{
  width: 50%;
  text-align: center;
  border: none;
  padding: 0 0 10px;
  cursor: pointer;
  color: #000;
}
.nav_bar>.nav_bar_actived {
	border-bottom: 1px solid #c59b5f;
	color: #c59b5f;
}
.code_box{
	width: 180px;
	height: 180px;
	margin: 0 auto;
	margin-bottom: 30px;
}
.fail_box{
	// width: 180px;
	height: 180px;
	margin: 0 auto;
	margin-bottom: 30px;
	text-align: center;
}
.ivu-avatar {
  background: url("~@/assets/local/images/headPortrait.png") no-repeat !important;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}
.footer_bottun {
  width: 368px;
  background: #c59b5f !important;
}
.login_button {
  width: 100%;
  color: #fff !important;
  padding: 14px 15px !important;
  font-size: 18px !important;
}
.logo_psw {
  margin: 34px 0;
}
.update_button {
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #3b3b3b;
  padding: 10px 17px;
  text-align: center;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  z-index: 222222222;
  span:first-child {
    color: #fff;
    font-size: 12px;
    font-family: Microsoft YaHei;
    margin-right: 5px;
  }

  button {
    background-color: #fff;
    border: none;
    border-radius: 5px;
    padding: 3px 8px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    color: #ff9947;
    cursor: pointer;
    &:last-child {
      margin-left: 15px;
    }
  }
}

.head_container {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  background-color: #3b3b3b;

  .head_left {
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      img {
        width: 100%;
        height: 100%;
      }
    }
    .left_font {
      margin-left: 15px;
      font-size: 18px;
      font-family: Microsoft YaHei;
      color: #c59b5f;
    }
  }
  .head_right {
    display: flex;
    align-items: center;
    justify-content: center;
    .comonStyle {
      margin-right: 25px;
      cursor: pointer;
      font-size: 12px;
      font-family: Microsoft YaHei;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      .comon_font {
        font-size: 14px;
        color: #f9f9f9;
        margin-left: 3px;
      }
      .common_img {
        width: 20px;
        height: 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .secne_div {
      margin-right: 22px;
    }
    .pic_head {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0px !important;
      .right_font {
        width: 60px;
      }
      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }
    }
  }
}
.height_five {
  height: 50px;
}
.height_three {
  height: 35px;
  border-bottom: 1px solid #454444;
}
.close_button {
  position: absolute;
  right: 12px;
  top: 10px;
  cursor: pointer;
}
.read_down {
  display: flex;
  justify-content: space-between;

  .read_button {
    width: 230px;
    height: 60px;
    font-size: 24px;
    font-family: SimHei;
    background-color: #c59b5f;
    color: #fff;
  }
  .read_color {
    background-color: #eee;
    color: #454444;
  }
}
.read_title {
  display: flex;
  /* display: inline-flex; */
  justify-content: center;
  align-items: center;
  padding: 30px 0 24px 0;
  span {
    font-size: 24px;
    font-family: SimHei;
    color: #333;
  }
  .last_span {
    color: #c49b5e;
    font-size: 30px;
  }
}

// .ivu-icon-ios-close:before {
//   content: "" !important;
// }
.ivu-btn:hover {
  color: #fff !important;
  background-color: #c59b5f !important;
  border-color: #c59b5f !important;
}
.ivu-btn + .read_color:hover {
  background-color: #f3f3f3 !important;
  border-color: #f3f3f3 !important;
  color: #454444 !important;
}
.ivu-modal-header {
  border-bottom: none !important;
  padding: 30px 0 !important;
}
.ivu-modal-body {
  padding: 0 30px 30px 30px !important;
}

.lincen_main {
  .lincen_name {
    position: relative;
    .licen_input {
      display: block;
      width: 100%;
      height: 37px;
      line-height: 1.5;
      padding: 4px 7px;
      font-size: 14px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      color: #515a6e;
      background-color: #eee;
      background-image: none;
      padding-left: 30px;
      cursor: text;
      font-family: SimHei;
    }
    .licen_img {
      position: absolute;
      top: 9px;
      left: 6px;
    }
    .lincen_warn {
      position: absolute;
      left: 0px;
      bottom: -23px;
      .lincen_warn_text {
        font-family: SimHei;
        font-size: 14px;
        color: #c39858;
      }
    }
  }
  .lincen_regin {
    display: flex;
    justify-content: space-between;
    margin-top: 31px;
    margin-bottom: 20px;
    .lincen_bottun {
      font-family: SimHei;
      width: 168px;
      background: #c59b5f !important;
      color: #fff;
      font-size: 16px;
    }
    .color_fff {
      background: #eee !important;
      color: #555555 !important;
    }
  }
}

.licen_input:focus {
  outline: none;
  border-color: #c59b5f !important;
  -webkit-box-shadow: 0 0 1px 1px rgba(197, 155, 95, 0.2) !important;
  box-shadow: 0 0 1px 1px rgba(197, 155, 95, 0.2) !important;
}

.licen_input:hover {
  border-color: #c59b5f !important;
}
.min {
  height: 100%;
  /* width: 35px; */
  padding: 0 10px;
  margin-right: 15px !important;
}

.drow_scroll {
  height: 300px !important;
  overflow: auto !important;
}
.drow_auto {
  height: auto !important;
  overflow: auto !important;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 8px;
  height: 10px;
  background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #d7d7d7;
}
.name_avatar {
  padding-left: 12px;
}
.name_real {
  margin-left: 0 !important;
  width: 92px !important;
}

.etc_box {
  .ivu-modal-body {
    padding: 0 0 30px 0 !important;
  }
  .ivu-modal-content {
    border-top-right-radius: 20px !important;
    border-top-left-radius: 20px !important;
    border-bottom-right-radius: 20px !important;
    border-bottom-left-radius: 20px !important;
  }
  .notice_img_box {
    height: 100px;
    .notice_img {
      width: 100%;
      height: 100%;
      border-top-right-radius: 20px;
      border-top-left-radius: 20px;
    }
  }

  .notic_content_box {
    padding: 0 20px;
    overflow-y: auto;
       height: 248px;
    .ect_title {
      padding: 0px 0 20px 0;
      font-size: 24px;
      font-family: SimHei;
      color: #4f546c;
      text-align: center;
    }
    .ect_content {
      pre{
        text-align: left;
        color: #4f546c;
        font-size: 16px;
        font-family: SimHei;
        word-wrap: break-word;
      }
    }
    .etc_time {
      text-align: right;

      padding: 20px;
      font-size: 16px;
      color: #4f546c;
    }
  }

  .etc_button {
    width: 90px;
    height: 32px;
    background: #c39858;
    color: #fff;
    margin: 0 auto;
    display: block;
    padding: 6px 15px 6px 15px;
    font-size: 14px;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
