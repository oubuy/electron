<template>
  <div class="tabbar">
    <div class="wrapper" ref="wrapper" :style="wrapperStyle">
      <div class="bscroll-container" >
        <osntv-no-data v-show="noDataFlag"></osntv-no-data>

        <!-- <div class="top-tip">
          <span class="refresh-hook">{{pulldownMsg}}</span>
        </div> -->
        <ul class="content">
          <li v-for="item in data" @click="handleInfo(item)">
            <div class="img_context">
              <img @load="imageLoad" :src="getImgLocalUrl(item.mainPicture+'?x-oss-process=image/resize,m_pad,h_1000,w_1000/quality,q_70')" alt="">
              <!-- <img :src="item.mainPicture" alt=""> -->
              <p><span>{{item.modityCode}}&nbsp;&nbsp;{{item.modityName}}</span></p>
            </div>
            <!-- <p><span>{{item.modityCode}}&nbsp;&nbsp;{{item.modityName}}</span></p> -->
          </li>
        </ul>
        <!-- 底部提示信息 -->
        <div class="bottom-tip" v-show="showTipFlag">
          <span class="loading-hook">{{pullupMsg}}</span>
        </div>
      </div>
    </div>

    <!-- alert提示刷新成功 -->
    <!-- <div class="alert-hook" :style="{display: alertHook}">刷新成功</div> -->
  </div>
</template>
<script>
import OsntvNoData from "../../components/osntv_no_data";
import BScroll from "better-scroll";
import $ from "jquery";
import { truncate } from 'fs';
const count = 1;
export default {
  data() {
    return {
      x:0,
      y:0,
      hasNextPage:true,
      wrapperHeight:0,//滚动栏高度
      data: [],
      noDataFlag:false,
      pulldownMsg: "下拉刷新",
      pullupMsg: "加载更多",
      formData: {
        pageSize: 20, //每页显示的条数
        pageNum: 1, //第几页  页码数
        modityName: "", //搜索名
        categoryId: "", //分类ID
        categoryName: "", //分类名称
        applicableStyleId: "", //风格ID
        applicableSpaceId: "", //空间ID
        colorName: "", //颜色ID
        specificationName: "" //规格ID
      },
      showTipFlag: false,
      scrollFlag: false,
      headerToken: { Authorization: "" }, //token
      getHeigt: 300
    };
  },
  props: ["mainSeach", "mainCityObj"],
  components: {
    OsntvNoData
  },
  computed: {
        wrapperStyle(){
        return 'height:' + this.wrapperHeight + 'px;'
        }
  },
  created() {
  
    this.headerToken.Authorization = "Bearer " + localStorage.getItem("token");
    if (this.headerToken.Authorization) {
      this.getListInfo();
    }
  },
  activated() {
   
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: 1,
          disableMouse: false,
          disableTouch: false,
          click: true
        });
      } else {
        this.scroll.refresh();
        this.scroll.scrollTo(this.x, this.y);
        // this.scroll.scrollTo(0, 0);
      }
    });
    
  },
  mounted(){
    let titleHeight = 35, navHeight = 50, siderPaddingHeight = 24, cardHeight=50;
    var screenHeight = document.documentElement.clientHeight;
    this.wrapperHeight = screenHeight - titleHeight - navHeight - siderPaddingHeight - cardHeight; //减去页面上固定高度height
    // console.log('screenHeight:',screenHeight)
    console.log('ScrollWrapperHeight:',this.wrapperHeight);
    setTimeout(() => {
      this._initScroll();
    }, 500);
  },
  methods: {
    imageLoad(){
this.scroll.refresh();
    },
    _initScroll(){
      const that = this;
      this.scroll = new BScroll(this.$refs.wrapper, {
        //初始化better-scroll
        probeType: 1, //1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
        disableMouse: false,
        disableTouch: false,
        click: true //是否派发click事件
      });
      // 滑动过程中事件
      this.scroll.on("scroll", pos => {
        if (pos.y > 30) {
          this.pulldownMsg = "释放立即刷新";
        }
      });
      //滑动结束松开事件
      // this.scroll.on("touchEnd", pos => {
      //   console.log(pos.y,'pos.ypos.y')
      //   //上拉刷新
      //   if (pos.y > 300) {
      //   } else if (pos.y < this.scroll.maxScrollY - 30) {
      //     //下拉加载
      //     console.log("下拉加载-----300");

      //     this.pullupMsg = "加载中。。。";
      //     this.formData.pageNum++;
      //     this.scrollFlag = true;
      //     that.pullupMsg = "加载更多";
      //     this.getListInfo();
      //   }
      // });
      this.scroll.on("touchEnd", pos => {
       
          this.x = this.scroll.x
          this.y = this.scroll.y
          if(this.scroll.y - this.scroll.maxScrollY < 2000){
            if(this.hasNextPage){
              this.pullupMsg = "加载中。。。";
              this.formData.pageNum++;
              this.scrollFlag = true;
              that.pullupMsg = "加载更多";
              this.getListInfo();
            }
          }
      });

    },
    handleInfo(data) {
      // this.$emit("goto-detail", data.skuModityId);
      this.$router.push({
        path: "/main/product_info",
        query: { product_flag: 1, modelId: data.skuModityId }
      });
    },
    getListInfo() {
      let self = this
      this.showTipFlag = true;
      this.$http({
        method: "get",
        url: "modity/findList",
        params: this.formData
        // headers: this.headerToken
      })
        .then(response => {
          if (response.data.code == 200) {
            // if(response.data.data.list){
            //   response.data.data.list.forEach(item=>{
            //     item.mainPicture = this.getImgLocalUrl(item.mainPicture +'?x-oss-process=image/resize,m_pad,h_1000,w_1000/quality,q_70')
            //   })
            // }
            if (this.scrollFlag == true) {
                if(response.data.data.list){
                  self.hasNextPage = response.data.data.list.length > 0;     
                  if (this.data && this.data.length != 0) {         
                    this.data = this.data.concat(response.data.data.list);
                  } else {
                    this.data = response.data.data.list;                    
                  }
                  this.noDataFlag = this.formData.pageNum==1 && response.data.data.list.length==0;
                }else{
                   this.$Message.success('没有更多数据');
                }
              this.scrollFlag = false;
            } else {
              self.hasNextPage = response.data.data.list.length > 0;
              if(this.formData.pageNum==1){              
                if(response.data.data.list.length>0){
                  this.noDataFlag = false;
                    this.data = response.data.data.list;
                }else{
                  this.data = null;
                  this.noDataFlag = true;
                }
              }
            }

            this.showTipFlag = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  watch: {
    mainSeach(newValue) {
      //    console.log(newValue,'---',oldValue)
      this.formData.buildingName = newValue;
    },
    mainCityObj: {
      handler(oldValue, newValue) {
        this.formData.modityName = newValue.modityName;
        this.formData.categoryId = newValue.categoryId;
        this.formData.applicableStyleId = newValue.applicableStyleId;
        this.formData.applicableSpaceId = newValue.applicableSpaceId;
        this.formData.specificationId = newValue.specificationId;
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>

.wrapper {
  width: 100%;
  height: 100vh;
  background: #fff;
  overflow: hidden;
  position: relative;
}

.content {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  li {
    position: relative;
    // width: 23.7%;
    // margin-right: 20px;
     width: 24.8%;
     padding:0 10px;
    margin-bottom:20px;
    cursor: pointer;
    .img_context {
      width: 100%;
     position:relative;
      img {
       
        width: 100%;
        border-radius: 4px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
      }
    }
    p {
      position: absolute;
      bottom: 4px;
      left: 0px;
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding-left: 20px;
      background: rgba(0, 0, 0, 0.6);
      /* color: #f5f1e5; */
      // text-align: center;
      font-size: 20px;
      color: #f9f9f9;
      border-radius: 4px;
      span{
        width: 90%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
      }
    }
  }
 
}

/* 下拉、上拉提示信息 */

.top-tip {
  position: absolute;
  top: -40px;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #555;
}

.bottom-tip {
  width: 100%;
  height: 35px;
  line-height: 35px;
  text-align: center;
  color: #777;
  background: #f2f2f2;
  position: absolute;
  bottom: -35px;
  left: 0;
}

/* 全局提示信息 */

.alert-hook {
  display: none;
  position: fixed;
  top: 62px;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 35px;
  line-height: 35px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  background: rgba(7, 17, 27, 0.5);
}
</style>
