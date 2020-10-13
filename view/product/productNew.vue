<template>
  <div>
    <nav-menu></nav-menu>
    <osntv-layout>
      <osntv-sider>
        <search-input
          slot="top"
          placeholder="请输入产品名称/型号"
          @button-click="search"
          v-model="keyword"
          style="height:60px;padding-bottom:24px;"
        ></search-input>

        <filter-box
          :title="ceramic_data.title"
          itemTitleProp="cateName"
          @on-filter="handleCeramic"
          :items="ceramic_data.arr"
        >
          <img slot="icon" src="~@/assets/local/images/left_ceramic.png" alt>
        </filter-box>

        <filter-box
          :title="key_data.title"
          itemTitleProp="cateName"
          @on-filter="handleKey"
          :items="key_data.arr"
        >
          <img slot="icon" src="~@/assets/local/images/left_space.png" alt>
        </filter-box>

        <filter-box
          :title="style_data.title"
          itemTitleProp="cateName"
          @on-filter="handleStyle"
          :items="style_data.arr"
        >
          <img slot="icon" src="~@/assets/local/images/left_style.png" alt>
        </filter-box>

        <filter-box
          :title="product_data.title"
          itemTitleProp="cateName"
          @on-filter="handleProduct"
          :items="product_data.arr"
        >
          <img slot="icon" src="~@/assets/local/images/left_specifications.png" alt>
        </filter-box>

        <div class="left_product">
          <div class="common_box">
            <div class="head_common">
              <img src="~@/assets/local/images/left_color.png" alt>
              <span>{{color_data.title}}</span>
            </div>
            <ul>
              <li
                :class="index%3!=2?'line_not_end':''"
                v-for="(item,index) in color_data.arr"
                :key="index"
                :style="{'background-color':item.remark}"
                @click="handleColor(item,index)"
              >
                <span>{{item.cateColor}}</span>
                <img
                  v-if="color_index==index"
                  class="attr_url"
                  src="~@/assets/local/images/check.png"
                  alt
                >
              </li>
            </ul>
          </div>
        </div>
      </osntv-sider>
      <Layout style="background: #f9f9f9">
        <Content style="padding-left:20px;background: #fff;">
          <div class="contnet_head" style="padding-top: 20px; padding-left:20px">
            <div class="contnet_head_card" ref="contnet_head_card">
              <ul>
                <li
                  :class="movie_index==index ? 'attr_color' : '' "
                  v-for="(item,index) in movieList"
                  :key="index"
                  @click="handleCategory(item,index)"
                  :style="card_item_width"
                >
                  <span>{{item.cateName}}</span>
                  <img
                    v-if="movie_index==index"
                    class="attr_url"
                    src="~@/assets/local/images/check.png"
                    alt
                  >
                </li>
                <span class="show_new" v-show="show_new">暂没有信息！！</span>
              </ul>
            </div>
            <img
              v-if="!show_height"
              class="contnet_head_img"
              src="~@/assets/local/images/up.png"
              alt
              @click="handleOpen"
            >
            <img
              v-else
              class="contnet_head_downimg"
              src="~@/assets/local/images/down.png"
              alt
              @click="handleOpen"
            >
          </div>
          <scroll-content ref="scrollVue" style="height:100px"></scroll-content>
        </Content>
      </Layout>
    </osntv-layout>
  </div>
</template>
<script>
import NavMenu from "../../components/nav_menu";
import OsntvScorllContent from "../../components/osntv_scorll_content";
import OsntvLayout from "../../components/osntv_layout";
import OsntvSider from "../../components/osntv_sider";
import SearchInput from "../../components/search_input";
import FilterBox from "../../components/filter_box";

import BScroll from "better-scroll";
import scrollContent from "./product_scroll1";
import $ from "jquery";
import Vue from "vue";

export default {
  data() {
    return {
      ceramic_index: 0,
      ceramic_data: {
        title: "瓷砖",
        arr: [{ id: "", cateName: "全部", children: [] }]
      },
      key_index: 0,
      key_data: {
        title: "空间",
        arr: [{ id: "", cateName: "全部", children: [] }]
      },
      style_index: 0,
      style_data: {
        title: "风格分类",
        arr: [{ id: "", cateName: "全部", children: [] }]
      },
      product_index: 0,
      product_data: {
        title: "产品规格",
        arr: [{ id: "", cateName: "全部", children: [] }]
      },
      color_index: 0,
      color_data: {
        title: "产品色系",
        arr: [
          {
            id: "",
            cateName: "全部",
            children: [],
            cateColor: "全部",
            remark: ""
          }
        ]
      },
      card_height:50,
      card_item_width:"width:150px",
      movie_index: 0,
      movieList: [],
      showTipFlag: false,
      headerToken: { Authorization: "" }, //token
      keyword: "",
      lastTimeStamp: 0,
      get_height: 0,
      show_height: true,
      maxHeight: "", // 页面最大高度
      show_new: false
    };
  },
  created() {
    this.headerToken.Authorization = "Bearer " + localStorage.getItem("token");
    if (this.headerToken.Authorization) {
      this.getCategoryList();
    }
    this.resizeEle($(".left_product"), 120); //默认自适应，距屏幕底部80px
    this.UpdateCardItemWidth();
  },
  activated() {
    console.log("重新激活");
    this.$nextTick(() => {
      // this.$refs.scrollVue.getListInfo();
    });
  },
  mounted() {
        this.$nextTick(() => {
      this.scrollHead = new BScroll(this.$refs.contnet_head_card, {
        //初始化better-scroll
        probeType: 1, //1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
        disableMouse: false,
        disableTouch: false,
        click: true, //是否派发click事件        
      });
    });
  },

  components: {
    NavMenu,
    scrollContent,
    OsntvLayout,
    OsntvScorllContent,
    OsntvSider,
    SearchInput,
    FilterBox
  },
  methods: {
    openKeyboard() {
      this.$electron.ipcRenderer.send("open-sys-keyboard");
      this.$refs.keyword.focus();
    },
    getCategoryList() {
      this.showTipFlag = true;
      this.$http({
        method: "get",
        url: "modity/getCategoryList"
      })
        .then(response => {
          if (response.data.code == 200) {
            this.ceramic_data.arr = this.ceramic_data.arr.concat(
              response.data.data.categoryList[0].children
            );
            this.key_data.arr = this.key_data.arr.concat(
              response.data.data.spaceList[0].children
            );
            this.style_data.arr = this.style_data.arr.concat(
              response.data.data.styleList[0].children
            );
            this.product_data.arr = this.product_data.arr.concat(
              response.data.data.specificationList[0].children
            );
            this.color_data.arr = this.color_data.arr.concat(
              response.data.data.colorList[0].children
            );
            for (var i in this.color_data.arr) {
              var str = this.color_data.arr[i];
              if (str.remark.indexOf("#") < 0) {
                this.color_data.arr[i].cateColor = this.color_data.arr[
                  i
                ].cateName;
              } else {
                this.color_data.arr[i].cateColor = "";
              }
            }
            this.showTipFlag = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //内容自适应窗口大小
    resizeEle(ele, isResetH) {
      var windowHeight = window.screen.height;
      this.viewHeight = windowHeight;
      this.maxHeight = windowHeight - isResetH;
    },
    handleCategory(item, index) {
      this.movie_index = index;
      this.$refs.scrollVue.formData.pageNum = 1;
      this.$refs.scrollVue.formData.categoryId = item.id;
      this.$refs.scrollVue.formData.modityName = this.keyword;
      this.$refs.scrollVue.getListInfo();
      this.$refs.scrollVue.scroll.scrollTo(0, 0);
    },
    handleCeramic(item, index) {
      if (item.cateName === "全部") {
        this.$refs.scrollVue.formData.pageNum = 1;
        this.$refs.scrollVue.formData.categoryId = "";
        this.$refs.scrollVue.formData.categoryName = "";
        this.$refs.scrollVue.formData.modityName = this.keyword;
        this.$refs.scrollVue.getListInfo();
      } else {
        this.$refs.scrollVue.formData.pageNum = 1;
        this.$refs.scrollVue.formData.categoryId = "";
        this.$refs.scrollVue.formData.categoryName = item.cateName;
        this.$refs.scrollVue.formData.modityName = this.keyword;
        this.$refs.scrollVue.getListInfo();
      }
      this.$refs.scrollVue.scroll.scrollTo(0, 0);
      this.movie_index = -1;
      this.ceramic_index = index;
      this.movieList = item.children;
      if (this.movieList != null) {
        // if (this.movieList.length !== 0) {
          $(".contnet_head_card")
            .height("50px")
            .animate({ height:Math.ceil(this.movieList.length/9)*this.card_height+"px" }, 500);
          this.show_height = false;
          this.UpdateWrapperHeight(true);
        // }
        this.show_new = false;
      } else {
        this.movieList=[];
        $(".contnet_head_card")
          .height("50px")
          .animate({ height: "0px" }, 500);
        this.show_height = true;
        this.UpdateWrapperHeight(false);
      }
    },
    //空间
    handleKey(item, index) {
      this.key_index = index;
      this.$refs.scrollVue.formData.pageNum = 1;
      this.$refs.scrollVue.formData.applicableSpaceId = item.id;
      this.$refs.scrollVue.formData.modityName = this.keyword;
      this.$refs.scrollVue.getListInfo();
      this.$refs.scrollVue.scroll.scrollTo(0, 0);
    },
    //风格
    handleStyle(item, index) {
      this.style_index = index;
      this.$refs.scrollVue.formData.pageNum = 1;
      this.$refs.scrollVue.formData.applicableStyleId = item.id;
      this.$refs.scrollVue.formData.modityName = this.keyword;
      this.$refs.scrollVue.getListInfo();
      this.$refs.scrollVue.scroll.scrollTo(0, 0);
    },
    //规格
    handleProduct(item, index) {
      this.product_index = index;
      this.$refs.scrollVue.formData.pageNum = 1;
      if (item.cateName === "全部") {
        this.$refs.scrollVue.formData.specificationName = "";
      } else {
        this.$refs.scrollVue.formData.specificationName = item.cateName;
      }
      this.$refs.scrollVue.formData.modityName = this.keyword;
      this.$refs.scrollVue.getListInfo();
      this.$refs.scrollVue.scroll.scrollTo(0, 0);
    },
    // 颜色
    handleColor(item, index) {
      this.color_index = index;
      this.$refs.scrollVue.formData.pageNum = 1;
      if (item.cateName === "全部") {
        this.$refs.scrollVue.formData.colorName = "";
      } else {
        this.$refs.scrollVue.formData.colorName = item.cateName;
      }
      this.$refs.scrollVue.formData.modityName = this.keyword;
      this.$refs.scrollVue.getListInfo();
      this.$refs.scrollVue.scroll.scrollTo(0, 0);
    },
    onkeyup(event) {
      if (event.keyCode != 13) {
        //除回车键外
        //标记当前事件函数的时间戳
        this.lastTimeStamp = event.timeStamp;
        setTimeout(() => {
          //1s后比较二者是否还相同（因为只要还有事件触发，lastTimeStamp就会被改写，不再是当前事件函数的时间戳）
          if (this.lastTimeStamp == event.timeStamp) {
            this.$refs.scrollVue.formData.pageNum = 1;
            this.$refs.scrollVue.formData.modityName = this.keyword;
            this.$refs.scrollVue.getListInfo();
          }
        }, 1000);
      }
    },
    search(d) {
      this.keyword = d;
      this.$refs.scrollVue.formData.pageNum = 1;
      this.$refs.scrollVue.formData.modityName = this.keyword;
      this.$refs.scrollVue.getListInfo();
    },
    handleOpen() {
      if (this.show_height == false) {
        let el = $(".contnet_head_card");
        let curHeight = el.height();
        el.height(curHeight).animate({ height: "0" }, 500);
        this.show_height = true;
        this.UpdateWrapperHeight(false);
        // this.$refs.scrollVue.wrapperHeight =
        //   this.$refs.scrollVue.wrapperHeight + 100;
        // console.log("changeWarpperHeight", this.$refs.scrollVue.wrapperHeight);
      } else {
        let el = $(".contnet_head_card");
        let curHeight = el.height();
        el.height(curHeight).animate({ height: Math.ceil(this.movieList.length/9)*this.card_height+"px" }, 500);
        this.show_height = false;
        if (this.movieList != null) {
          this.UpdateWrapperHeight(true);
          this.show_new = false;
        } else {
          this.UpdateWrapperHeight(false);
          this.show_new = true;
        }

        // this.$refs.scrollVue.wrapperHeight =
        //   this.$refs.scrollVue.wrapperHeight - 100;
        // console.log("changeWarpperHeight", this.$refs.scrollVue.wrapperHeight);
      }
    },
    UpdateWrapperHeight(isOpen){
      let titleHeight = 35, navHeight = 50, siderPaddingHeight = 24, cardCloseHeight=50,cardOpenHeight=Math.ceil(this.movieList.length/9)*this.card_height+30;
      var screenHeight = document.documentElement.clientHeight;
      if(isOpen){
          this.$refs.scrollVue.wrapperHeight = screenHeight - titleHeight - navHeight - siderPaddingHeight - cardOpenHeight; 
      }else{
          this.$refs.scrollVue.wrapperHeight = screenHeight - titleHeight - navHeight - siderPaddingHeight - cardCloseHeight; 
      }
      console.log('ProductWrapperHeight:', this.$refs.scrollVue.wrapperHeight);
    },
    UpdateCardItemWidth(){
      let leftWidth = 300, marginSize = 20+200+18+23;
      var screenWidth = document.documentElement.clientWidth;
      var item_width = (screenWidth - leftWidth - marginSize)/9;
      this.card_item_width = " width:"+item_width+"px";
      console.log('CardItemWidth:', this.card_item_width);
    }
  },
  watch: {
    get_height(val, oldVal) {
      console.log(val, "发送请求", oldVal);
    }
  }
};
</script>

<style lang="less" scoped>
.left_product {
  // box-shadow: 2px 0 3px -1px #d1d8de;
  .common_box {
    margin-top: 10px;
    .head_common {
      display: flex;
      align-items: center;
      span {
        margin-left: 6px;
        color: #555;
        font-size: 24px;
        display: inline-block;
      }
    }
    ul {
      list-style-type: none;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 15px;
      .color_box {
        width: 68px;
      }
      li {
        // width: 69px;
        width: 68px;
        position: relative; // padding: 0 6px;
        height: 36px;
        color: #c59b5f;
        // margin-right: 24px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #c59b5f;
        cursor: pointer;
        border-radius: 3px;
        .attr_color {
          height: 36px;
          display: flex;
          padding: 0 6px;
          background-color: #fff0e7;
          width: 100%;
          align-items: center;
          justify-content: center;
        }
        .attr_url {
          position: absolute;
          right: 0;
          bottom: 0;
        }
        span {
          font-size: 13px;
          // padding: 0 6px;
        }
      }
      .line_not_end {
        margin-right: 24px;
      }
    }
  }
}


.contnet_head {
  position: relative;
  margin-top: 20px;
  box-shadow: 0 0 10px rgba(190, 190, 190, 0.8);
  margin-bottom: 20px;
  margin-right: 18px;
  padding: 5px;
  .contnet_head_card {
    height: 0px;
    overflow: hidden;
    .attr_color {
      display: flex;
      padding: 0 6px;
      background-color: #fff0e7;
      align-items: center;
      justify-content: center;
    }
  }
  ul {
    list-style-type: none;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    li {
      width: 150px;
      padding: 0 6px;
      height: 30px;
      color: #c59b5f;
        margin-right: 22px;
        margin-bottom: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #c59b5f;
        cursor: pointer;
        border-radius: 3px;
        position: relative;
        .attr_url {
          position: absolute;
          right: 0;
          bottom: 0;
        }
      
      span {
        font-size: 14px;
      }
    }
  }
  .contnet_head_img {
    position: absolute;
    left: 48.5%;
    bottom: 0;
    cursor: pointer;
  }
  .contnet_head_downimg {
    position: absolute;
    left: 48.5%;
    bottom: -24px;
    cursor: pointer;
    z-index: 300;
  }
}

.show_new {
  text-align: center;
  display: inline-block;
  width: 100%;
  font-size: 18px;
}
</style>