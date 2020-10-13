<template>
<div>
    <nav-menu></nav-menu>    
    <osntv-layout>
        <left-content :param="spaceQueryParam" @change-param="handleChangeQueryParam"></left-content>
        <Content ref="content" class="case_list_content">
            <osntv-no-data v-show="noDataFlag"></osntv-no-data>
            <osntvWaterfall v-show="!noDataFlag"
            ref="waterfall" 
            :imgsArr="dataList" 
            :gap = "waterfall.gap"
            :srcKey="waterfall.srcKey"
            :maxCols="waterfall.maxCols" 
            :loadingTimeOut="waterfall.loadingTimeOut"
            :checkCode = "spaceQueryParam.reqCode"
            @click="handleItemClick"
            @scrollReachBottom="fetchNextPageData">
                <template slot-scope="props">
                    <slot :value="props.value"></slot>
                    <!-- <div class="img_title_content">
                        <span class="title">{{props.value.spaceName}}</span>
                    </div> -->
                </template>
                <div slot="waterfall-over">到底了</div>
            </osntvWaterfall>
        </Content>
    </osntv-layout>

    <!-- <Modal v-model="showConfirmWin" footer-hide :mask-closable="false" width="610" class-name="vertical-center-modal">      
       <div>
          <div>
            <div class="read_title">
              <span>当前网速较慢（或网络不稳定），操作过快可能会引起数据展示异常！</span>
            </div>
            <div class="read_down">              
               <Button class="read_button" @click="justDoIt">继续</Button>
               <Button class="read_button" @click="justDoIt">不再提示</Button>
               <Button class="read_button read_color" @click="cancel">取消</Button>
            </div>
          </div>
      </div>        
    </Modal> -->
</div>
</template>

<script>
import NavMenu from "./nav_menu";
import leftContent from "./common_left";
import OsntvLayout from "./osntv_layout";
import OsntvNoData from "./osntv_no_data";
import OsntvWaterfall from "./waterfall/osntv-waterfall";
import {
    findSpace
} from "./api/building.js";
export default {
    components: {
        NavMenu,
        leftContent,
        OsntvLayout,
        OsntvNoData,
        OsntvWaterfall
    },
    props: {
        caseType: {
        type: String,
        default: 'xgt'
        },
    },
    data() {
        return {
            filter:undefined,
            showConfirmWin:false,
            noDataFlag:false,
            dataList:[],
            waterfall:{
                gap:20,
                maxCols:4,
                srcKey:'imageUrl',
                loadingTimeOut:100,
                scrollTop:0
            },
            spaceQueryParam: {
                spaceName: '',
                spaceTypeId: '',
                styleId: '',
                modelTypeId: '',
                caseModelArea: '',
                isXGT: this.caseType=='xgt',
                isYJHZ: this.caseType=='yjhz',
                isVR: this.caseType=='vr',
                isDIY: false,
                isUE4: false,
                page: 1,
                rows: 16,
                reqCode:Math.random().toString(36).slice(-8)
            }
        };
    }, 
    created() {
        this.fetchData()
    },    
    mounted(){
    },
    methods: {
        handleItemClick(e,item){
            this.$emit('item-click',e,item)
            // this.$router.push({
            //         path: "/main/case_info",
            //         query: {
            //             case_flag: 3,
            //             spaceId: item.value.spaceId
            //         }
            //     });
        },
        handleChangeQueryParam(item,index) {
            // this.filter = that            
            if(this.$refs.waterfall.isPreloading && this.dataList.length>0){
                this.$Message.warning({
                    content:'当前网速环境不佳，操作过快容易引起数据展示异常！',
                    duration:5,
                    closable:true
                    });
            }
            this.spaceQueryParam.reqCode = Math.random().toString(36).slice(-8)
            this.spaceQueryParam.page = 1
            this.fetchData()
        },
        fetchNextPageData(){
            this.spaceQueryParam.page++
            this.fetchData()
        },
        fetchData(){
            findSpace(this.spaceQueryParam).then(resp => {
                // console.log("resp:",resp.data.data.pageNum)
                if (resp.data.code == 200){
                    console.log('resp.data.msg:',resp.data.msg)
                    if(resp.data.msg != '查询成功' && resp.data.msg != this.spaceQueryParam.reqCode){
                        //校验请求编码
                        return
                    }

                    let list = resp.data.data.list
                    for(var i=0;i<list.length;i++){
                        list[i].imageUrl = this.getResizeImageUrl(list[i].imageUrl)
                    }
                    if(resp.data.data.pageNum==1){
                        this.$refs.waterfall.reset()
                        if(list.length>0){
                            this.noDataFlag = false
                            this.dataList = []
                            this.dataList = this.dataList.concat(resp.data.data.list);
                        }else{
                            this.noDataFlag = true
                            this.dataList = []
                        }
                    }else{                        
                        if(list.length>0){
                            this.dataList = this.dataList.concat(resp.data.data.list);
                        }else{
                            this.$refs.waterfall.waterfallOver()
                        }
                    }

                }
            })
        },        
        getResizeImageUrl(imageUrl) {
            if(!imageUrl) return
            imageUrl = imageUrl.replace(
                /pic.oceano.com.cn/,
                "oceano-osnhome.oss-cn-hangzhou.aliyuncs.com"
            );
            // imageUrl = imageUrl.replace(
            //     /center.oceano.com.cn/,
            //     "oceano-center.oss-cn-hangzhou.aliyuncs.com"
            // );
            return imageUrl + "?x-oss-process=image/resize,m_fixed,w_1000/quality,q_70";
        }
    }
};
</script>
<style lang="less">
.case_list_content{
    padding:14px 0px 0px 0px;
    background: #fff;
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
}

</style>
