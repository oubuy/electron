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
        <Content ref="content" style="padding:14px 0px 0 0px;background: #fff;">
            <osntv-no-data v-show="noDataFlag"></osntv-no-data>
            <osntvWaterfall v-show="!noDataFlag"
            ref="waterfall" 
            :imgWidth="waterfall.imgWidth" 
            :imgsArr="sceneList" 
            :width="waterfall.width" 
            :maxCols="waterfall.maxCols" 
            srcKey="thumbUri" 
            @click="listItemClick"
            @scrollReachBottom="fetchData">
                <template slot-scope="props">
                    <div class="img_title_content">
                        <span class="title">{{props.value.title}}</span>
                        <span class="icon">
                            <img :src="downloadStateImg[props.value.downloadState]">
                            <img v-if="props.value.downloadState==status.FINISHED||props.value.downloadState==status.STOPPED||props.value.downloadState==status.RUNNING||props.value.downloadState==status.WAITING" src="~@/assets/local/images/delete.png" @click.stop="confirmDeleteScene(props.value)">                          
                        </span>
                    </div>
                    <!-- <div v-if="props.value.downloadState==status.RUNNING||props.value.downloadState==status.WAITING" style="position: absolute;top: 0;left:0;z-index: 99;background-color: #000;width: 100%;position: absolute;height: 100%;opacity: 0.5;padding:10px 10px;"></div> -->
                    <div v-if="props.value.downloadState==status.RUNNING||props.value.downloadState==status.WAITING" class="img_mask" :style="'width:'+props.value._width+'px;height:'+props.value._height+'px'"></div>
                    <div v-if="props.value.downloadState==status.RUNNING||props.value.downloadState==status.WAITING" style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;width:150px;height:150px;margin:auto;z-index:999">
                    <i-circle :percent="props.value.progress" :size="150" stroke-color="#c49b5e" trail-color="rgba(255,255,255,0.3)">
                        <div style="color:#c49b5e;text-align:center;font-size:20px">{{props.value.progress||0}}%</div>
                    </i-circle>

                </div>
                </template>
                <div slot="waterfall-over">到底了</div>
            </osntvWaterfall>
        </Content>
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
</div>
</template>

<script>
import NavMenu from "../../components/nav_menu";
// import OsntvScorllContent from "../../components/osntv_scorll_content";
import OsntvLayout from "../../components/osntv_layout";
import OsntvSider from "../../components/osntv_sider";
import SearchInput from "../../components/search_input";
import FilterBox from "../../components/filter_box";
import OsntvNoData from "../../components/osntv_no_data";
// import VueWaterfallEasy from "vue-waterfall-easy";
import OsntvWaterfall from "../../components/waterfall/osntv-waterfall";

// import SceneList from "./scene-list";
import {
    exists
} from 'fs';
import Vue from 'vue'

export default {
    components: {
        NavMenu,
        OsntvLayout,
        OsntvNoData,
        // OsntvScorllContent,
        OsntvSider,
        SearchInput,
        FilterBox,
        // SceneList,
        OsntvWaterfall
    },
    computed:{
        // imgWidth(){
        //     return (this.$refs.content.offsetWidth - 100)/4
        // },
        // waterfallWidth(){
        //     return this.$refs.content.offsetWidth - 10
        // }
    },
    watch:{
    },
    mounted(){
        this.waterfall.imgWidth = (this.$refs.content.$el.clientWidth - 100)/4
        this.waterfall.width = this.$refs.content.$el.clientWidth - 10
        console.log("this.$refs.content.offsetWidth:",this.$refs.content.$el.clientWidth)
        console.log("imgWidth:",this.waterfall.imgWidth)
        console.log("width:",this.waterfall.width)
    },
    data() {
        return {
            noDataFlag:false,
            waterfall:{
                // imgWidth:380,
                // width:1610,
                imgWidth:240,
                width:1500,
                height:500,
                maxCols:4
            },
            sceneList:[],
            // fetchList:[],

            showDeleteWin:false,
            readyDeleteScene:null,
            scenes: {
                list: [],
                page: 1,
                pageSize: 20,
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
            downloadState: this.$electron.remote.getGlobal('config').DOWNLOAD_STATE,
            downloadStateImg: [
                require("@/assets/local/images/l_uncomplete.png"),
                require("@/assets/local/images/download_stoped.png"),
                require("@/assets/local/images/l_loading.png"),
                require("@/assets/local/images/l_loading.png"),
                require("@/assets/local/images/l_complete.png")
            ],
            status: this.$electron.remote.getGlobal("config").DOWNLOAD_STATE
        }
    },
    created() {
        let autoDownload = this.$route.query.autoDownload
        // console.log('autoDownload:', autoDownload)


        this.$electron.ipcRenderer.on("scenes-loaded", this.onScenesloaded)
        this.$electron.ipcRenderer.on("update-scene-state", this.updateSceneState)
        this.$electron.ipcRenderer.on("update-scene-progress", this.updateSceneProgress)
        this.$electron.ipcRenderer.on("ue4-exited", this.ue4Exited)
        this.$electron.ipcRenderer.on("scene-deleted", this.sceneDeleted)

        if (autoDownload) {
            this.autoStart()
            this.$nextTick(() => {
                this.loadScenes()
            })
        }else{
            this.loadScenes()
        }
        // console.log('-------------------page created')
        
        // this.$nextTick(() => {
        //   this.loadNextPage()
        // })
        // setTimeout(() => {
        //     this.loadNextPage();
        // }, 2000);
    },
    destroyed(){
        this.$electron.ipcRenderer.removeListener("scenes-loaded", this.onScenesloaded)
        this.$electron.ipcRenderer.removeListener("update-scene-state", this.updateSceneState)
        this.$electron.ipcRenderer.removeListener("update-scene-progress", this.updateSceneProgress)
        this.$electron.ipcRenderer.removeListener("ue4-exited", this.ue4Exited)
        this.$electron.ipcRenderer.removeListener("scene-deleted", this.sceneDeleted)
    },
    methods: {
        fetchData(){
            console.log("fetchData");
            this.loadNextPage()
            // if(this.fetchList.length>0){
            //     this.sceneList = this.sceneList.concat(this.fetchList)
            //     this.loadNextPage()
            // }else{
            //     this.$refs.waterfall.waterfallOver()
            // }
        },


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
        updateSceneState(event, job) {
            // console.log('updateDownloadState:', job)
            for (var i = 0; i < this.sceneList.length; i++) {
                // let element = this.sceneList[i]
                if (this.sceneList[i].uuid === job.id) {
                    this.sceneList[i].downloadState = job.status
                    // element.progress = job.state.percent
                    Vue.set(this.sceneList[i], 'progress', job.state.percent)
                    break;
                }
            }
        },
        updateSceneProgress(event, jobId, state) {
            console.log('updateSceneProgress')
            let progress = state.percent || 0;
            for (var i = 0; i < this.sceneList.length; i++) {
                if (this.sceneList[i].uuid == jobId) {
                    Vue.set(this.sceneList[i], 'progress', progress)
                    break;
                }
            }
        },
        listItemClick(e,data) {
            let item =data.value
            console.log('click ',data)
            if(this.$electron.remote.getGlobal("arch")=='32-bit'){
                this.$Message.warning('VR场景漫游仅支持64位操作系统,请升级硬件')
                return
            }
            // console.log('listItemClick',config)
            switch (item.downloadState) {
                case this.downloadState.FINISHED:
                    console.log('已下载，打开UE4程序')
                    // this.$Spin.show();
                    // setTimeout(() => {
                    //     this.$Spin.hide();
                    // }, 10000);
                    this.$electron.ipcRenderer.send("open-ue4-scene", item);
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
        sceneDeleted(event, uuid){
            console.log('sceneDeleted:',uuid)
            for(var i=0;i<this.sceneList.length;i++){
                if(this.sceneList[i].uuid==uuid){
                    this.sceneList[i].downloadState=0
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
            this.$refs.waterfall.reset()
            this.scenes.isMaxPage = false
            this.scenes.page = 1
            // this.sceneList = []
            this.sceneList = []
            // this.fetchList = []
            this.loadScenes()
            // setTimeout(() => {
            //     this.loadNextPage();
            // }, 2000);
        },
        loadScenes() {
            
            // console.log("loadScenes");
            // console.log('loadScenes length:',this.sceneList.length)
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
            console.log("params:",params)
            this.$electron.ipcRenderer.send("load-scenes", params);
        },
        onScenesloaded(event, scenes) {
            this.scenes.loading = false;
            console.log('onScenesloaded:',scenes)
            // console.log('onScenesloaded:',scenes[0].title)
            if (scenes.length <= 0) {
                console.log('no more scenes')
                if (this.scenes.page === 1) {
                    this.sceneList = []     
                    // this.fetchList = []  
                    this.$refs.waterfall.waterfallOver()
                    this.noDataFlag = true;
                }else{
                    this.scenes.isMaxPage = true
                    // this.fetchList = []
                    this.noDataFlag = false;    
                    this.$refs.waterfall.waterfallOver() 
                }
            } else {                
                this.noDataFlag = false;   
                this.sceneList = this.sceneList.concat(scenes)
                console.log('sceneList add:',this.sceneList.length)
                // if (this.scenes.page === 1) {
                //     this.sceneList = scenes
                //     // this.loadNextPage();
                // } else {
                //     this.fetchList = scenes
                // }
                //获得最新下载进度信息（避免刚加载数据时，下载进度一直显示0%）
                this.$electron.ipcRenderer.send("update-progress");
                // console.log('onScenesloaded:', this.sceneList)
            }            
        }
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


.vue-waterfall-easy-container .vue-waterfall-easy a.img-inner-box {
      -webkit-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.6);
              box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.6);
      border-radius: 0px;
}

.img_title_content{
    padding:0px 10px;
    background:rgba(0, 0, 0, 0.6);
    height:50px;
    margin-top:-50px;
    line-height:50px;
    color:#f5f1e5;
    font-size:20px;
    position:relative; 
    display:flex;
    justify-content: space-between;
    .title{
        width: 75%;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .icon{
        display: inline-flex;
        align-items: center;
        img{
            margin-left: 10px;
        }
    }
}

.img_mask{
    position: absolute;
    top: 10px;
    left:10px;
    z-index: 99;
    background-color: #000;
    opacity: 0.5;
}

</style>
