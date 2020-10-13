<template>
    <div>
         <nav-menu></nav-menu>
         
        <div class="product_box" :style="{height: maxHeight+'px', overflow: 'auto'}" @scroll="handleScroll($event)">
          <head-detail ref="headDetail"></head-detail>
        </div>
          <Spin v-if="spinShow" fix></Spin>
    </div>
</template>
<script>
import headDetail from "./product_detail";
import NavMenu from "../../components/nav_menu";

import $ from "jquery";
import {
    getInfo
} from "../../components/api/modity.js";
import {
    listSpaceType,
    listStyle
} from "../../components/api/building.js";
export default {
  data() {
    return {
      maxHeight: "", // 页面最大高度
      modelId:this.$route.query.modelId,
       spinShow: false
    };
  },
  components: {
    headDetail,
    NavMenu,
   
   
  },
  created() {
    this.$nextTick(function() {});
    this.resizeEle($(".product_box"), 120); //默认自适应，距屏幕底部80px
    this.getData();
    // console.log(this.$route.query ,7777)
  },

  methods: {
    resizeEle(ele, isResetH) {
      var windowHeight = window.screen.height;
      this.viewHeight = windowHeight;
      this.maxHeight = windowHeight - isResetH;
    },
    handleScroll(event) {    
      this.$refs.scroll_bottom.skinwheel(event)
    },
    getData(){
      let params = {
          skuModityId: this.modelId
      };
      this.spinShow = true;
      getInfo(params).then(resp => {
          if (resp.data.code == 200 && resp.data.data) {
            if(resp.data.data.modityImageUrlList && resp.data.data.modityImageUrlList.length>0){
               for(var i in resp.data.data.modityImageUrlList){
                 resp.data.data.modityImageUrlList[i] = resp.data.data.modityImageUrlList[i]+'?x-oss-process=image/resize,m_pad,h_2000,w_2000';
                //  resp.data.data.modityImageUrlList[i] = this.getImgLocalUrl(resp.data.data.modityImageUrlList[i]+'?x-oss-process=image/resize,m_pad,h_2000,w_2000');
               }
            }
            console.log( resp.data.data,'modelParams')
                 this.$refs.headDetail.modelParams = resp.data.data;
                 this.$refs.headDetail.fetchData();
                 this.$refs.headDetail.config.value= resp.data.data.shortUrl;
                //  `http://modity.oceano.com.cn/modityDetailPage?officialModel=${resp.data.data.officialModel}`
                //  var categoryNamePath = resp.data.data.categoryNamePath;
                //  var categoryList = new Array();
                //  categoryList =    categoryNamePath.split("/");
                //  if(categoryList.length>=3){
                //     this.$refs.headDetail.modelParams.categoryName=categoryList[1];
                //     this.$refs.headDetail.modelParams.seriesName=categoryList[2];
                //  }        

          }
             this.spinShow = false;
        }).catch(()=>{
          this.spinShow = false;
        })
    }
  }
};
</script>
<style lang="less" scoped>
</style>
