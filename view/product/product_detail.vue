<template>
<div ref="wrapper" class="wrapper" style="position:absolute; top:85.2px; bottom:0; width: 100%;">
  
    <div class="detail_contianer" style="position:relative; padding:20px;">
        <div class="build_top_container">
                <div class="build_top_left">
                
                      <!-- <big-image :list='modelParams.modityImageUrlList'></big-image> -->
                    <auto-image :list='modelParams.modityImageUrlList'></auto-image>
                   
                 
                </div>
                <v-touch @swiperight="swiperight" style="top:0;bottom:0; width:100%;">
                <div class="build_top_right">
                  <div class="box_centex">
                   <div class="left_contex">
                      <!-- <h3>{{modelParams.officialModel}}&nbsp;{{modelParams.modityName}}</h3> -->
                      <h3>{{modelParams.modityName}}</h3>
                      <p v-if="modelParams.categoryNamePath">分类&nbsp;:&nbsp;&nbsp;<span>{{modelParams.categoryNamePath.split("/")[1]}}</span></p>
                      <p v-if="modelParams.categoryNamePath">系列&nbsp;:&nbsp;&nbsp;<span>{{modelParams.categoryNamePath.split("/")[2]}}</span></p>
                      <p v-if="modelParams.officialModel">型号&nbsp;:&nbsp;&nbsp;<span>{{modelParams.officialModel}}</span></p>
                      <!-- <p v-if="modelParams.skuModitySize">产品规格&nbsp;:&nbsp;&nbsp;<span>{{modelParams.skuModitySize}}mm</span></p> -->
                      <p v-if="modelParams.skuModitySize">规格&nbsp;:&nbsp;&nbsp;<span>{{modelParams.skuModitySize}}<span v-show="showDanwei">mm</span></span></p>
                   </div>
                    <div class="right_contex">
                           <!-- <vue-qr class="qr_img" :text="config.value" :size="250" :margin="10" :dotScale="1" :logoScale="0.23" :logoSrc="config.src"></vue-qr> -->
                    </div>
                  </div>
                  
                
                   <div class="button_box">
                      <img src="~@/assets/local/images/collect.png" alt="" class="button_img">
                        <Button class="star_button" @click="handleFavorites(modelParams)">
                        收藏
                    </Button>
                   </div>
                  <!-- <div class="char_p">
                     <p v-if="modelParams.characteristics">特点&nbsp;:&nbsp;&nbsp;<span>{{modelParams.characteristics}}</span></p>
                    <p v-if="modelParams.applicationSpace">应用范围&nbsp;:&nbsp;&nbsp;<span>{{modelParams.applicationSpace}}</span></p>
                    <p v-if="modelParams.description">产品描述&nbsp;:&nbsp;&nbsp;<span>{{modelParams.description}}</span></p>

                  </div> -->
                  <div class="nowrap_p" @click="handleShowApplication">
                    <p class="one_p" v-if="modelParams.characteristics">特点&nbsp;:&nbsp;&nbsp;<span>{{modelParams.characteristics}}</span></p>
                    <p class="tow_p">应用范围&nbsp;:&nbsp;&nbsp;<span>{{modelParams.applicationSpace}}</span></p>
                    <!-- <p class="three_p">产品描述&nbsp;:&nbsp;&nbsp;<span>{{modelParams.description}}</span></p> -->

                  </div>
                  <Modal
                  width="1200"
                   class-name="vertical-center-modal"
                      v-model="showApplication"
                      >
                     <!-- <div class="close_button" @click="handleClose"><img src="~@/assets/local/images/close1.png" alt=""></div> -->
                     <p style="padding-top: 28px;">特点&nbsp;:&nbsp;&nbsp;<span>{{modelParams.characteristics}}</span></p>
                     <p>应用范围&nbsp;:&nbsp;&nbsp;<span>{{modelParams.applicationSpace}}</span></p>
                     <!-- <p>产品描述&nbsp;:&nbsp;&nbsp;<span>{{modelParams.description}}</span></p> -->
                      <div slot="footer"></div>
                  </Modal>
                

                
                </div>
                </v-touch>
         </div>
          <v-touch @swiperight="swiperight" style="top:0;bottom:0; width:100%;">
                  <!-- 案例查询条件 -->
        <div>
            <div class="itemstyle_box">
                <div @click="spaceSearchType=0" class="item_tile">
                    <span :class="{ choose_a: spaceSearchType==0 }">空 间</span>
                </div>
                <div @click="spaceSearchType=1" class="item_tile">
                    <span :class="{ choose_a: spaceSearchType==1 }">风 格</span>
                </div>
                <Checkbox v-model="spaceQueryParam.isDIY" @on-change="handleDIYChange" size="large">DIY</Checkbox>
                <Checkbox v-model="spaceQueryParam.isVR" @on-change="handleVRChange" size="large">720全景</Checkbox>
                <Checkbox v-model="spaceQueryParam.isUE4" @on-change="handleUE4Change" size="large">VR漫游</Checkbox>
                
            </div>
            <div class="selected_box">
                <ul v-show="spaceSearchType==0">
                    <li v-for="(item, index) in spaceTypeList" :key="index" @click="spaceQueryParam.spaceTypeId=item.spaceTypeId;handleSearchSpace();">
                        <span :class="{ seceted_color: item.spaceTypeId==spaceQueryParam.spaceTypeId }">{{item.spaceTypeName}}</span>
                    </li>
                </ul>
                <ul v-show="spaceSearchType==1">
                    <li v-for="(item, index) in styleList" :key="index" @click="spaceQueryParam.styleId=item.styleId;handleSearchSpace();">
                        <span :class="{ seceted_color: item.styleId==spaceQueryParam.styleId }">{{item.styleName}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 案例查询结果 -->
        
        <div class="img_wrap">
            <div v-for="(list, col) in spaceList" :id="'img_col_' + col" class="img_col">
                <div v-for="(space, index) in list">
                    <div class="img_container" @click="handleChild(space)">
                        <img :src="getImgLocalUrl(space.imageUrl)"></img>
                        <!-- {{space.spaceName}} -->
                        <div class="name_display">{{space.styleName}}{{space.spaceTypeName}}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="loading" style="text-align:center; font-size:14px;">加载中...</div>
     </v-touch>
    </div>
</div>
</template>
<script>
import {
  listSpaceType,
  listStyle,
  findSpace
} from "../../components/api/building.js";
import { addFavorites } from "../../components/api/favorites.js";
import BScroll from "better-scroll";
import { mapActions } from "vuex";
import VueQr from "vue-qr";
import bigImage from "../../components/bigImage";
import autoImage from "../../components/autoProduceImage";

// const glob = require('glob')
export default {
  data() {
    return {
      invTime: 2000,
      slides: [
        {
          src: "https://pic.oceano.com.cn/osntv/banner/banner1(3840).jpg",
          title: "测试测试测试1",
          href: "detail/analysis"
        },
        {
          src: "https://pic.oceano.com.cn/osntv/banner/banner3(3840).jpg",
          title: "测试测试测试2",
          href: "detail/count"
        }
      ],

      productPramas: {
        showFlag: true
      },
      showDanwei: false, //显示单位
      showApplication: false,
      swiperSlides: [],
      config: {
        //二维码参数
        src: require("../../assets/local/images/logoCode.png"),
        value: "" //显示的值、跳转的地址
      },
      modelParams: {},
      spaceTypeList: [],
      styleList: [],
      spaceQueryParam: {
        productId: "",
        spaceTypeId: "",
        styleId: "",
        isDIY: false,
        isVR: false,
        isUE4: false,
        page: 1,
        rows: 8
      },
      //   style_data: ["空间", "风格", "户型"],
      style_data: [
        {
          title: "空间",
          arr: ["客厅", "餐厅", "卧室", "书房", "厨房", "卫浴"]
        },
        {
          title: "风格",
          arr: ["休闲", "风格", "卧室", "书房", "厨房", "卫浴"]
        }
        // ,
        // {
        //   title: "户型",
        //   arr: ["三房一厅", "二房一厅", "东南向", "书房", "厨房", "卫浴"]
        // }
      ],
      choose_index: 0,
      selected_data: [],
      selected_index: Number,
      loading: false,
      spaceList: [new Array(), new Array(), new Array(), new Array()],
      spaceColHeight: [0, 0, 0, 0],
      hasNextPage: false,
      spaceSearchType: 0,
      sceneType: null
    };
  },
  created() {
    this.fetchSpaceTypeList();
    this.fetchStyleList();
    if (this.scroll) {
      this.scroll.scrollTo(0, 0);
    }
    if (this.refresh) {
      this.resetData();

      // if (this.modelParams.modityId) {
      //   this.spaceQueryParam.productId = this.modelParams.modityId;
      //     this.fetchSpaceData(false);
      // }
    }

    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.wrapper, {
          pullUpLoad: {
            threshold: -30
          },
          disableMouse: false,
          disableTouch: false,
          click: true
        });
        this.scroll.on("pullingUp", () => {
          if (this.hasNextPage) {
            this.spaceQueryParam.page++;
            this.fetchSpaceData(true);
          }
        });
      } else {
        this.scroll.refresh();
        this.scroll.scrollTo(0, 0);
      }
    });

    setTimeout(() => {
      let str = this.modelParams.categoryNamePath;
      if (str.indexOf("辅料") != -1) {
        this.showDanwei = false;
      } else {
        this.showDanwei = true;
      }
    }, 600);
  },
  components: {
    VueQr,
    bigImage,
    autoImage
  },
  props: {
    refresh: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    modelParams: {
      handler(val, oldVal) {},
      deep: true
    },
    sceneType: function(val) {
      this.spaceQueryParam.isDIY = null;
      this.spaceQueryParam.isVR = null;
      this.spaceQueryParam.isUE4 = null;
      if (val === "0") {
        this.spaceQueryParam.isDIY = true;
      } else if (val === "1") {
        this.spaceQueryParam.isVR = true;
      } else if (val === "2") {
        this.spaceQueryParam.isUE4 = true;
      }
    }
  },

  mounted() {
    this.selected_data = this.style_data[0].arr;
  },

  methods: {
    handleClose() {
      this.showApplication = false;
    },
    handleShowApplication() {
      this.showApplication = true;
    },
    swiperight() {
      this.$router.go(-1);
    },
    handleChild(data) {
      console.log("modelParams:", this.modelParams);
      this.$router.push({
        path: "/main/product_children_info",
        query: {
          product_flag: 1,
          modelId: data.spaceId,
          modityCode: this.modelParams.modityCode
        }
      });
    },
    handleChoose(item, index) {
      this.choose_index = index;
      this.selected_data = item.arr;
      this.selected_index = Number;
    },
    handleSelcetd(item, index) {
      this.selected_index = index;
    },
    fetchData() {
      if (this.modelParams.skuModityId) {
        this.spaceQueryParam.productId = this.modelParams.skuModityId;
        this.fetchSpaceData(false);
      }
    },
    fetchSpaceTypeList() {
      listSpaceType().then(resp => {
        if (resp.data.code == 200) {
          this.spaceTypeList = [
            {
              spaceTypeId: "",
              spaceTypeName: "全部"
            }
          ];
          resp.data.data.forEach(item => {
            this.spaceTypeList.push(item);
          });
        }
      });
    },
    fetchStyleList() {
      listStyle().then(resp => {
        if (resp.data.code == 200) {
          this.styleList = [
            {
              styleId: "",
              styleName: "全部"
            }
          ];
          resp.data.data.forEach(item => {
            this.styleList.push(item);
          });
        }
      });
    },
    handleDIYChange(val) {
      if (val) {
        this.spaceQueryParam.isVR = false;
        this.spaceQueryParam.isUE4 = false;
      }
      this.handleSearchSpace();
    },
    handleVRChange(val) {
      if (val) {
        this.spaceQueryParam.isDIY = false;
        this.spaceQueryParam.isUE4 = false;
      }
      this.handleSearchSpace();
    },
    handleUE4Change(val) {
      if (val) {
        this.spaceQueryParam.isDIY = false;
        this.spaceQueryParam.isVR = false;
      }
      this.handleSearchSpace();
    },
    handleSearchSpace() {
      this.spaceQueryParam.page = 1;
      this.fetchSpaceData(false);
    },
    fetchSpaceData(displayMore) {
      //
      if (this.loading) {
        return;
      }
      this.loading = true;
      findSpace(this.spaceQueryParam).then(resp => {
        if (resp.data.code == 200) {
          this.hasNextPage = resp.data.data.hasNextPage;
          if (!displayMore) {
            this.spaceList = [
              new Array(),
              new Array(),
              new Array(),
              new Array()
            ];
            this.spaceColHeight = [0, 0, 0, 0];
          }
          this.handleSpaceImage(
            resp.data.data.list ? resp.data.data.list : [],
            0,
            new Array()
          );
        }
        if (this.scroll) {
          this.scroll.finishPullUp();
        }
        this.loading = false;
      });
    },
    getResizeImageUrl(imageUrl) {
      imageUrl = imageUrl.replace(
        /pic.oceano.com.cn/,
        "oceano-osnhome.oss-cn-hangzhou.aliyuncs.com"
      );
      // imageUrl = imageUrl.replace(
      //   /center.oceano.com.cn/,
      //   "oceano-center.oss-cn-hangzhou.aliyuncs.com"
      // );
      return (
        imageUrl + "?x-oss-process=image/resize,m_fixed,w_1000/quality,q_70"
      );
    },
    handleSpaceImage(list, index, tempArray) {
      if (list.length < index + 1) {
        return;
      }
      let space = list[index];
      space.imageUrl = this.getResizeImageUrl(space.imageUrl);
      // space.imageUrl = this.getImgLocalUrl(space.imageUrl)
      let img = new Image();
      img.src = space.imageUrl;
      img.onerror = function() {
        return false;
      };
      if (img.complete) {
        this.handleAddSpaceImage(img, list, index, tempArray);
        this.handleSpaceImage(list, index + 1, tempArray);
      } else {
        var self = this;
        img.onload = function() {
          self.handleAddSpaceImage(img, list, index, tempArray);
          self.handleSpaceImage(list, index + 1, tempArray);
        };
      }
    },
    handleAddSpaceImage(img, list, index, tempArray) {
      let imgWidth = document.querySelector("#img_col_0").clientWidth;
      let imgHeight = img.height * imgWidth / img.width;
      tempArray.push({
        imgHeight,
        index
      });
      if (tempArray.length == 4 || list.length - index == 1) {
        for (let i = 0; i < tempArray.length - 1; i++) {
          for (let j = i + 1; j < tempArray.length; j++) {
            if (tempArray[i].imgHeight < tempArray[j].imgHeight) {
              let temp = tempArray[i];
              tempArray[i] = tempArray[j];
              tempArray[j] = temp;
            }
          }
        }
        tempArray.forEach(item => {
          let minHeightIndex = this.spaceColHeight.indexOf(
            Math.min.apply(Math, this.spaceColHeight)
          );
          this.spaceList[minHeightIndex].push(list[item.index]);
          this.spaceColHeight[minHeightIndex] += item.imgHeight;
        });
        tempArray.splice(0, tempArray.length);
      }
    },
    resetData() {
      this.modelParams = {};
      this.spaceQueryParam = {
        productId: this.modelParams.modityId,
        spaceTypeId: "",
        styleId: "",
        isDIY: false,
        isVR: false,
        isUE4: false,
        page: 1,
        rows: 8
      };
      this.spaceList = [new Array(), new Array(), new Array(), new Array()];
      this.spaceColHeight = [0, 0, 0, 0];
      this.hasNextPage = false;
      this.spaceSearchType = 0;
      this.sceneType = null;
    },
    handleFavorites(model) {
      console.log("model:", model);
      let param = {
        mac: this.$electron.remote.getGlobal("mac"),
        entityUrl: model.mainPicture,
        entityId: model.skuModityId,
        entityName: model.modityName
      };
      // this.$store.dispatch('Favorites/addProduct',param)
      this.addFavorites(param);
      this.$Message.success("收藏成功");
      //   this.loading = true;
      //   var param=
      //   {
      //     mac:this.$electron.remote.getGlobal('mac'),
      //     entityType:"modity",
      //     entityId:model.modityId
      //   }
      //   addFavorites(param).then(resp => {
      //   if (resp.data.code == 200) {
      //      console.log('收藏成功');
      //      this.$Message.success('收藏成功');
      //   }
      //   this.loading = false;
      // });
    },
    ...mapActions("Favorites", {
      addFavorites: "addProduct" // 映射 this.addFavorites() to this.$store.dispatch('Favorites/addProduct')
    })
  }
};
</script>

<style lang="less" scoped>
.swiper-container-coverflow
  .swiper-container-3d
  .swiper-container-initialized
  .swiper-container-horizontal {
  background-color: white !important;
}
.swiper-container {
  background-color: white !important;
}
.detail_contianer {
  padding: 20px 15px 0 15px;
  .build_top_container {
    display: flex;

    .build_top_left {
    }
    .build_top_right {
      width: 60%;
      float: left;
     
      width: 100%;
      padding-left: 40px;

      h3 {
        font-family: SimHei;
        font-weight: 700;
        //   font-style: normal;
        font-size: 36px;
        color: #0c0d21;
        margin-bottom: 12px;
      }
      .star_button {
        background: #c59b5f;
        color: #fff;
        // width: 149px;
        // height: 36px;
        font-size: 18px;
      }
      p {
        font-size: 26px;
        // font-size: 1.8vw;
        color: #333;
        line-height: 50px;
        white-space: normal;
        span {
          color: #777777;
        }
      }
      .nowrap_p {
        cursor: pointer;
        p {
          // width: 63%;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
        }

        .one_p {
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .tow_p {
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          margin: 12px 0;
        }
        .three_p {
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
      .box_centex {
        display: flex;
        align-items: center;

        .left_contex {
          flex: 1;
          h3 {
            font-family: SimHei;
            font-weight: 700;
            //   font-style: normal;
            font-size: 2.4vw;
            color: #313131;
          }
          p {
            white-space: nowrap;
            font-size: 1.4vw;
            color: #333;
            line-height: 50px;
            span {
              color: #777777;
            }
          }
        }
        .right_contex {
          float: right;

          .qr_img {
            width: 60%;
            box-shadow: 0 0 11px rgba(0, 0, 0, 0.5);
          }
        }
      }
    }
  }
  .itemstyle_box {
    margin-top: 30px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #c59b5f;
    border-left: 1px solid #c59b5f;
    background: #f9f9f9;
    .item_tile {
      width: 300px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #c59b5f;
      border-top: 1px solid #c59b5f;
      cursor: pointer;
      span {
        font-size: 30px;
        color: #333;
        display: inline-block;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .choose_a {
        background: #c59b5f;
        color: #fff;
      }
    }
  }
  .selected_box {
    margin: 20px 0;
    ul {
      list-style: none;
      display: flex;
      align-items: center;

      li {
        margin-right: 50px;
        cursor: pointer;

        span {
          color: #333;
          font-size: 24px;
        }

        .seceted_color {
          color: #ff5a0a;
        }
      }
    }
  }
}

.img_wrap {
  display: flex;
  align-items: flex-start;

  .img_col {
    flex: 1;

    .img_container {
      width: 100%;
      cursor: pointer;
      margin-bottom: 20px;
      position: relative;

      img {
        width: 100%;
      }

      .name_display {
        position: absolute;
        left: 0;
        bottom: 4px;
        width: 100%;
        height: 50px;
        line-height: 50px;
        background: rgba(0, 0, 0, 0.6);
        color: #f5f1e5;
        font-size: 20px;
        padding-left: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .img_col + .img_col {
    margin-left: 20px;
  }
}

// img {
//   box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
//   -moz-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
//   -webkit-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
// }
.wrapper {
  overflow: hidden;
}

.ivu-checkbox-wrapper.ivu-checkbox-large {
  font-size: 24px;
  margin-left: 50px;
  vertical-align: middle;
}

.detail_contianer .build_top_container .build_top_right .star_button {
  width: 180px;
  height: 45px;
}
.button_box {
  position: relative;
  .button_img {
    position: absolute;
    top: 11px;
    left: 51px;
  }
}

.ivu-modal-body {
  p {
    font-size: 26px;
    color: #333;
    line-height: 50px;
    span {
      color: #777777;
    }
  }
}
</style>

