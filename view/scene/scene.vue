<template>
<div>
    <nav-menu></nav-menu>
    <osntv-layout>
        <osntv-sider>
            <search-input slot="top" placeholder="请输入场景名称" @button-click="loadScenesFirstPage" v-model="filter.keyword" style="height:60px;padding-bottom:24px;">
            </search-input>
            <filter-box :title='filter.title' @on-filter='handleFilter' :items="filter.state" >
                <Icon slot='icon' type="md-download" size='24' color='#c59b5f' />
            </filter-box>
        </osntv-sider>
        <osntv-scorll-content :data="scenes.list" @scrollToEnd="loadNextPage">
                <scene-list ref='scene-list' @listItemClick="listItemClick" @iconClick="confirmDeleteScene" :dataList="scenes.list" itemTitle="title" itemImg='thumbUri'></scene-list>
                <div v-show="scenes.loading" class="loading-wrapper">加载中...</div>
        </osntv-scorll-content>
    </osntv-layout>
    <!-- 提醒是否删除场景 -->
    <Modal v-model="showDeleteWin" footer-hide :mask-closable="false" width="600" class-name="vertical-center-modal">      
       <div>
          <div>
            <div class="read_title">
              <span>确认删除本场景吗，删除后想要再次使用需要重新下载哦！</span>
            </div>
            <div class="read_down">              
               <Button class="read_button" @click="deleteScene">是</Button>
               <Button class="read_button read_color" @click="cancelDeleteScene">取消</Button>
            </div>
          </div>
      </div>        
    </Modal>
    <!-- 提醒是否跳转一键换砖列表 -->
    <Modal v-model="showToYjhzWin" footer-hide :mask-closable="false" width="600" class-name="vertical-center-modal">      
       <div>
          <div>
            <div class="read_title">
              <span>浏览场景请去一键换砖界面，是否跳转？</span>
            </div>
            <div class="read_down">              
               <Button class="read_button" @click="toYjhz">立刻跳转</Button>
               <Button class="read_button read_color" @click="cancelToYjhz">取消</Button>
            </div>
          </div>
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
</div>
</template>

<script>
import NavMenu from "../../components/nav_menu";
import OsntvScorllContent from "../../components/osntv_scorll_content";
import OsntvLayout from "../../components/osntv_layout";
import OsntvSider from "../../components/osntv_sider";
import SearchInput from "../../components/search_input";
import FilterBox from "../../components/filter_box";

import SceneList from "./scene-list";
import {
    exists
} from 'fs';
import Vue from 'vue'

export default {
    components: {
        NavMenu,
        OsntvLayout,
        OsntvScorllContent,
        OsntvSider,
        SearchInput,
        FilterBox,
        SceneList
    },
    data() {
        return {
            showToYjhzWin:false,
            showDeleteWin:false,
            readyDeleteScene:null,
            currentSelectedScene:null,
            scenes: {
                list: [],
                page: 1,
                pageSize: 100,
                isMaxPage: false,
                loading: false
            },
            filter: {
                title: '下载状态',
                state: [{
                    key: '全部',
                    val: 'all'
                }, {
                    key: '已下载',
                    val: 'finished'
                }, {
                    key: '未下载',
                    val: 'not_finished'
                }, {
                    key: '正在下载',
                    val: 'downloading'
                }],
                currentIndex: 0,
                keyword: ''
            },
			scene: {
                showDownloadWin: false,
                readToDownloadNum: 0
            },
            downloadState: this.$electron.remote.getGlobal('config').DOWNLOAD_STATE
        }
    },
    created() {
        let autoDownload = this.$route.query.autoDownload
        // console.log('autoDownload:', autoDownload)
        if (autoDownload) {
            this.autoStart()
        }

        this.$electron.ipcRenderer.on("scenes-loaded", this.onScenesloaded)
        this.$electron.ipcRenderer.on("update-scene-state", this.updateSceneState)
        this.$electron.ipcRenderer.on("update-scene-progress", this.updateSceneProgress)
        this.$electron.ipcRenderer.on("ue4-exited", this.ue4Exited)
        this.$electron.ipcRenderer.on("scene-deleted", this.sceneDeleted)
        // this.$electron.ipcRenderer.on("scene-remote-search", this.sceneRemoteSearch)
		this.$electron.ipcRenderer.once("scene-download-ready",this.redayToDownloadScenes);
        
        // console.log('-------------------page created')
        this.loadScenes()
        this.$electron.ipcRenderer.send("find-not-downloaded-scenes");
    },
    destroyed(){
        this.$electron.ipcRenderer.removeListener("scenes-loaded", this.onScenesloaded)
        this.$electron.ipcRenderer.removeListener("update-scene-state", this.updateSceneState)
        this.$electron.ipcRenderer.removeListener("update-scene-progress", this.updateSceneProgress)
        this.$electron.ipcRenderer.removeListener("ue4-exited", this.ue4Exited)
        this.$electron.ipcRenderer.removeListener("scene-deleted", this.sceneDeleted)
        // this.$electron.ipcRenderer.removeListener("scene-remote-search", this.sceneRemoteSearch)
    },
    methods: {
        openKeyboard() {
            this.$electron.ipcRenderer.send("open-sys-keyboard");
            this.$refs.keyword.focus();
        },
        ue4Exited(event, code) {
            console.log('ue4Exited code:', code)
        },
        autoStart() {
            this.$electron.ipcRenderer.send("auto-start-download");
        },
        handleFilter(item, index) {
            // console.log('handleFilter:', item)
            this.filter.currentIndex = index;
            this.loadScenesFirstPage()
            // if(this.filter.currentIndex != index){
            //   //换了过滤条件
            //   this.filter.currentIndex = index;
            //   this.loadScenesFirstPage()
            // }else{
            //   //换了没有换过滤条件
            //   console.log('不需要重新加载数据')
            // }
        },        
        // sceneRemoteSearch(event,keyword){
        //     this.filter.keyword = keyword
        //     this.loadScenesFirstPage()
        // },
        updateSceneState(event, job) {
            console.log('updateDownloadState:', job)
            for (var i = 0; i < this.scenes.list.length; i++) {
                // let element = this.scenes.list[i]
                if (this.scenes.list[i].uuid === job.id) {
                    this.scenes.list[i].downloadState = job.status
                    // element.progress = job.state.percent
                    Vue.set(this.scenes.list[i], 'progress', job.state.percent)
                    break;
                }
            }
        },
        updateSceneProgress(event, jobId, state) {
            // console.log('11111-------progress:',jobId,state)
            let progress = state.percent || 0;
            // let speed = state.speed / 1024;
            // console.log('speed/1024:', state.speed / 1024)
            // console.log('speed:', speed)
            // if (speed > 1024) {
            //     speed = (speed / 1024).toFixed(2) + 'MB'
            // } else {
            //     speed = parseInt(speed) + 'KB'
            // }
            
            // console.log('scenes.list.length:',this.scenes.list.length)

            for (var i = 0; i < this.scenes.list.length; i++) {
                if (this.scenes.list[i].uuid == jobId) {
            // console.log('22222---set progress:', jobId, progress + '%')
                    Vue.set(this.scenes.list[i], 'progress', progress)
                    // this.scenes.list[i].progress = progress
                    // Vue.set(this.scenes.list[i], 'speed', speed)
                    break;
                }
            }
            // console.log('progress:', jobId, progress + '%')

        },
        listItemClick(item) {
            this.currentSelectedScene = item;
            if(this.$electron.remote.getGlobal("arch")=='32-bit'){
                this.$Message.warning('VR场景漫游仅支持64位操作系统,请升级硬件')
                return
            }
            switch (item.downloadState) {
                case this.downloadState.FINISHED:
                    // console.log('已下载，打开UE4程序')
                    // this.$electron.ipcRenderer.send("open-ue4-scene", item);
                    
                    this.showToYjhzWin = true
                    break;
                case this.downloadState.RUNNING:
                    console.log('正在下载，暂停')
                    this.$electron.ipcRenderer.send("stop-download-scene", item);
                    break;
                case this.downloadState.WAITING:
                    console.log('等待中，暂停')
                    this.$electron.ipcRenderer.send("stop-download-scene", item);
                    break;
                default:
                    console.log('未下载，开始下载')
                    this.$electron.ipcRenderer.send("start-download-scene", item);
                    break;
            }
        },
        confirmDeleteScene(item){
            this.showDeleteWin = true
            this.readyDeleteScene = item
            console.log('confirmDeleteScene:',item)
        },
        deleteScene(){
            // this.showDeleteWin = true
            console.log('delete item:')
            console.log('delete item:',this.readyDeleteScene.uuid)
            if(this.readyDeleteScene.downloadState==this.downloadState.RUNNING){
                this.$electron.ipcRenderer.send("stop-download-scene", this.readyDeleteScene);
            }
            this.$electron.ipcRenderer.send("delete-scene", this.readyDeleteScene.uuid);
            this.showDeleteWin = false
        },
        cancelDeleteScene(){
            this.showDeleteWin = false
        },
        toYjhz(){            
            this.showToYjhzWin = false
            this.$router.push({
                    path: "/main/change_brick",
                    query: {
                        change_brick_flag: 5,
                        case_type: 'yjhz',
                        ue4SceneId: this.currentSelectedScene.uuid,
                        ue4SceneName: this.currentSelectedScene.title
                    }
                });
        },
        cancelToYjhz(){
            this.showToYjhzWin = false
        },
        sceneDeleted(event, uuid){
            console.log('sceneDeleted:',uuid)
            for(var i=0;i<this.scenes.list.length;i++){
                if(this.scenes.list[i].uuid==uuid){
                    this.scenes.list[i].downloadState=0
                    break;
                }
            }
            
        },
        loadNextPage() {
            // console.log('loadNextPage');
            if (!this.scenes.isMaxPage) {
                this.scenes.page++
                this.loadScenes(this.filter.state[this.filter.currentIndex])
            }
        },
        loadScenesFirstPage() {
            // console.log('loadScenesFirstPage')
            this.scenes.isMaxPage = false
            this.scenes.page = 1
            this.scenes.list = []
            this.loadScenes()
        },
        loadScenes() {
            // console.log('loadScenes length:',this.scenes.list.length)
            this.scenes.loading = true;
            let selectedState = this.filter.state[this.filter.currentIndex].val

            // let selectedState = null
            // if(!filterItem){
            //   selectedState = this.filter.state[0].val
            // }
            // selectedState = filterItem.val
            let state = []
            if (selectedState === 'finished') {
                state.push(this.downloadState.FINISHED)
            } else if (selectedState === 'downloading') {
                state.push(this.downloadState.RUNNING)
                state.push(this.downloadState.WAITING)
            } else if (selectedState === 'not_finished') {
                state.push(this.downloadState.READY)
                state.push(this.downloadState.STOPPED)
            }

            let params = {
                page: this.scenes.page,
                pageSize: this.scenes.pageSize,
                keyword: this.filter.keyword,
                state: state
            }
            // console.log("params:",params)
            this.$electron.ipcRenderer.send("load-scenes", params);
        },
        onScenesloaded(event, scenes) {
            this.scenes.loading = false;
            // console.log('onScenesloaded:',scenes)
            if (scenes.length <= 0) {
                console.log('no more scenes')
                this.scenes.isMaxPage = true
            } else {
                if (this.scenes.page === 1) {
                    this.scenes.list = scenes                    
                } else {
                    this.scenes.list = this.scenes.list.concat(scenes)
                }
                //获得最新下载进度信息（避免刚加载数据时，下载进度一直显示0%）
                this.$electron.ipcRenderer.send("update-progress");
                // console.log('onScenesloaded:', this.scenes.list)
            }
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
        gotoDownloadScenes() {
            this.scene.showDownloadWin = false;
            this.autoStart();
        },
        cancelGotoDownloadScenes() {
            this.scene.showDownloadWin = false;
        },
    }
};
</script>

<style lang="less" scoped>
.wrapper {
    width: 100%;
    height: 975px;
    background: #fff;
    overflow: hidden;
    // position: relative;
}

.loading-wrapper {
    text-align: center;
}


.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}
.read_down {
  display: flex;
  justify-content: space-between;
  .read_button {
    width: 230px;
    height: 60px;
    font-size: 20px;
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
  justify-content: center;
  align-items: center;
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
</style>
