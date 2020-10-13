<template>
<div>
    <nav-menu></nav-menu>    
    <osntv-layout>
        <left-content :param="spaceQueryParam" @change-param="handleChangeQueryParam"></left-content>
        <Content ref="content" style="padding:14px 0px 0px 10px;background: #fff;">
            <osntv-no-data v-show="noDataFlag"></osntv-no-data>
            <osntvWaterfall v-show="!noDataFlag"
            ref="waterfall" 
            :imgsArr="dataList" 
            :gap = "waterfall.gap"
            :srcKey="waterfall.srcKey"
            :maxCols="waterfall.maxCols" 
            :loadingTimeOut="waterfall.loadingTimeOut"
            @click="handleItemClick"
            @scrollReachBottom="fetchNextPageData">
                <template slot-scope="props">
                    <div class="img_title_content">
                        <span class="title">{{props.value.spaceName}}</span>
                    </div>
                </template>
                <div slot="waterfall-over">到底了</div>
            </osntvWaterfall>
        </Content>
    </osntv-layout>
</div>
</template>

<script>
import NavMenu from "../../components/nav_menu";
import leftContent from "../../components/common_left";
import OsntvLayout from "../../components/osntv_layout";
import OsntvNoData from "../../components/osntv_no_data";
import OsntvWaterfall from "../../components/waterfall/osntv-waterfall";
import {
    findSpace
} from "../../components/api/building.js";
export default {
    components: {
        NavMenu,
        leftContent,
        OsntvLayout,
        OsntvNoData,
        OsntvWaterfall
    },
    data() {
        return {
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
                isVR: true,
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
            this.$router.push({
                    path: "/main/case_info",
                    query: {
                        full_spherical_flag: 4,
                        spaceId: item.value.spaceId
                    }
                });
        },
        handleChangeQueryParam() {
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
                console.log("resp:",resp.data.data.pageNum)
                if (resp.data.code == 200){
                    let list = resp.data.data.list
                    for(var i=0;i<list.length;i++){
                        list[i].imageUrl = this.getResizeImageUrl(list[i].imageUrl)
                    }
                    if(resp.data.data.pageNum==1){
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
</style>