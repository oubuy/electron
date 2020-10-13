<template>
<div class="detail_contianer">
    <div class="build_top_container">
        <div class="build_top_left">
            <Card id="imageCard" style="width: 100%; height: 93%; text-align:center;" class="left_card">
              <!-- <div v-show="!complete_flag" :style="{height:imageHeight +'px'}" style="display: flex; align-items: center; justify-content: center;">
                <img src="~@/assets/local/images/move.gif" @load="handleComplete(index)">
              </div>
              <swiper v-show="complete_flag" :options="swiperOption">
                  <swiper-slide v-for="(item,index) of spaceImages" :key="item">
                    <div :style="{height:imageHeight +'px'}" style="display: flex; align-items: center; justify-content: center;">
                      <img :src="getImgLocalUrl(item)" @load="handleComplete(index)" :style="{'maxHeight':imageHeight +'px', 'maxWidth':'100%'}">
                    </div>
                  </swiper-slide>
                  <div v-show="spaceImages.length>1" class="swiper-pagination" slot="pagination"></div>
                  <div v-show="spaceImages.length>1" class="swiper-button-prev" slot="button-prev"></div>
                  <div v-show="spaceImages.length>1" class="swiper-button-next" slot="button-next"></div>
              </swiper> -->
              <div :style="{'maxHeight':imageHeight +'px'}"  style="display: flex; align-items: center; justify-content: center;">
               <!-- <div :style="{'maxHeight': '93vh','height':'100%'}" style="display: flex; align-items: center; justify-content: center; position: relative;"> -->
                <img v-if="complete_flag"  src="~@/assets/local/images/move.gif" alt="">
                <!-- <img v-show="loading_flag" class="getImg" :src="getImgLocalUrl(getResizeImageUrl(buildingParams.imageUrl))" id="imageChangeEle" @load="handleComplete" alt="" :style="{'maxHeight':imageHeight +'px', 'maxWidth':'100%'}"> -->
                <img v-show="loading_flag" class="getImg" :src="getImgLocalUrl(getResizeImageUrl(buildingParams.imageUrl,0,80))" id="imageChangeEle" @load="handleComplete" alt="" :style="{'maxHeight':imageHeight +'px', 'maxWidth':'100%'}">
              

            </div>
             <!-- 以最外层盒子定位 -->
            <div class="relative_box" v-show="showSpaceFlag">
                  <div class="relativeContainer">
                  <div class="relative_wrap" ref="personWrap">
                    <!-- v-show="showPictureCenter" -->
                    <ul class="relative_list" ref="li1" v-show="showPictureCenter">
                      <li class="relative_item" v-for="(item,index) in relativeNewList" :key="index" :class="item.showColorFlag?'originRelativeSpace':''" @click="handleChangeRelativeSpace(item)">
                          <img :src="getImgLocalUrl(getResizeImageUrl(item.imageUrl,0,80))" alt="" class="relative_img">
                          <div class="text_bottom">{{item.spaceTypeName}}</div>
                      </li>
                    </ul>
                    <ul class="relative_list relative_center_item" ref="li2" v-show="!showPictureCenter">
                      <li class="relative_item"  v-for="(item,index) in relativeNewList" :key="index" :class="item.showColorFlag?'originRelativeSpace':''" @click="handleChangeRelativeSpace(item)">
                         <img :src="getImgLocalUrl(getResizeImageUrl(item.imageUrl,0,80))" alt="" class="relative_img">
                          <div class="text_bottom">{{item.spaceTypeName}}</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
               <div class="delete_botton" @click="handleCloseSpace" v-show="showSpaceFlag">
                  <img  src="~@/assets/local/images/close_3.png" alt="">
                </div>
                <div class="right_button" v-show="showRightFlag">
                    <img  src="~@/assets/local/images/info_right.png" alt="">
                </div>
                  <div class="left_button" v-show="showLeftFlag">
                    <img  src="~@/assets/local/images/info_left.png" alt="">
                </div>
             
           
            </Card>
        </div>
        <v-touch @swiperight="swiperight" class="build_top_right">
            <div>
                <div class="box_centex">
                    <div class="left_contex">
                      
                        <h3 class="h_name">{{buildingParams.spaceName}}</h3>
                        <p>案例编号&nbsp;:&nbsp;&nbsp;<span>{{buildingParams.spaceId}}</span></p>
                        <p>所属标签&nbsp;:&nbsp;&nbsp;<span>{{buildingParams.styleName}}</span></p>
                        <p>空间面积&nbsp;:&nbsp;&nbsp;<span v-if="buildingParams.spaceArea">{{buildingParams.spaceArea}}㎡</span></p>
                        
                    </div>
                    <div class="right_contex">
                        <!-- <vue-qr v-if="show_qr" class="qr_img" :text="config.value" :size="250" :margin="10" :dotScale="1" :logoScale="0.23" :logoSrc="config.src"></vue-qr> -->
                    </div>
                </div>

                <!-- <div class="button_box" @click="handleFavorites(buildingParams)">
                    <img class="button_img" src="~@/assets/local/images/collect.png" alt="">
                    <Button class="star_button">
                        收藏
                    </Button>
                </div> -->
                <div class="all_button">
                   <!-- <div class="button_box button_margin">
                        <img class="button_diy" src="~@/assets/local/images/relative.png" alt="">
                        <Button class="star_button">
                            关联案例
                        </Button>
                    </div> -->
                     <div class="button_box button_margin" v-show="relativeShowFlag" @click="handleShowSpace">
                        <img src="~@/assets/local/images/relative.png" alt="">
                        <div>
                            关联案例
                        </div>
                    </div>
                    <!-- 视频按钮 -->
                      <div class="button_box button_margin"  v-show="figureShowFlag" @click="handleShowVideo">
                        <img src="~@/assets/local/images/watch.png" alt="">
                        <div>
                          视频
                        </div>
                    </div>
                     <!-- 弹框 -->
                      <div class="alet_container" v-show="showVideo">
                        <section class="tip_text_container">
                           <div class="rightClose">
                                 <img src="~@/assets/local/images/close1.png" alt="" @click="closeTip">
                            </div>
                            <video :src="buildingParams.videoUrl" style="width: 100%;object-fit: fill;" controls></video>
                           
                        </section>
                       
                    </div>

                    <div class="button_box button_margin" v-show="showBrickFlag" @click="handleFavorites(buildingParams)">
                        <img class="button_img" src="~@/assets/local/images/collect.png" alt="">
                        <div class="star_button">
                            收藏
                        </div>
                    </div>
                       <!-- v-if="show_Vr && buildingParams.sceneId" -->
                    <div class="button_box button_margin"  @click="handleWeb(0)" v-if="show_Vr && buildingParams.sceneId">
                        <img class="button_diy" src="~@/assets/local/images/diy_new.png" alt="">
                        <div class="star_button">
                            DIY 换砖
                        </div>
                    </div>
                    <!-- v-if="show_720 && buildingParams.panoramaImagePath"  -->
                    <div class="button_box button_margin" @click="handleWeb(1)" v-if="show_720 && buildingParams.panoramaImagePath">
                        <img class="button_img" src="~@/assets/local/images/720.png" alt="">
                        <div class="star_button">
                            720°
                        </div>
                    </div>

                    <!-- <div class="button_box" v-if="show_Vr && buildingParams.ue4SceneId && sceneDownloaded"  @click="openVr">
                        <img class="button_img" src="~@/assets/local/images/vr_new.png" alt="">                        
                        <Button class="star_button">
                            VR
                        </Button>
                    </div>                     -->
                    <!-- <div class="button_box" v-if="show_Vr && buildingParams.ue4SceneId && !sceneDownloaded">
                        <Poptip
                            confirm
                            title="当前场景未下载，是否马上下载?"
                            @on-ok="downloadScene">
                        <img class="button_img" src="~@/assets/local/images/vr_new.png" alt="">
                        <Button class="star_button">
                            VR
                        </Button>                    
                        </Poptip>
                    </div> -->
                    <!-- v-if="show_Vr && buildingParams.ue4SceneId"   -->
                    <div class="button_box" @click="checkSceneState" v-if="show_Vr && buildingParams.ue4SceneId">
                        <img class="button_img" src="~@/assets/local/images/vr_new.png" alt="">                        
                        <div class="star_button">
                            VR
                        </div>
                    </div> 
                     <Modal v-model="vr_flag" footer-hide :mask-closable="false" width="420" :closable="false" class-name="vertical-center-modal">
                          <p class="title_vr">当前场景未下载，是否马上下载?</p>
                          <div class="read_down">              
                              <Button class="read_button" @click="handleOk">确定</Button>
                              <Button class="read_button read_color" @click="handleCancle">取消</Button>
                          </div>
                    </Modal>
                </div>
              <!-- 旧代码 -->
                 <!-- <div class="box">
                  <div class="person-wrap" ref="personWrap">
                    <ul class="person-list" ref="li1">
                       <li class="person-item originSpace" v-show="relativeOriginSpace.originFlag" @click="handleRelativeSpaceInfo(relativeOriginSpace.originalSpace)">
                          <img :src="getImgLocalUrl(relativeOriginSpace.originalSpace.imageUrl)" alt="">
                          <div class="text_bottom">原图</div>
                      </li>
                      <li class="person-item" v-for="(item,index) in relateSpaceList" :key="index" @click="handleRelativeSpaceInfo(item)">
                         <img :src="getImgLocalUrl(item.imageUrl)" alt="">
                         <div class="text_bottom">换砖{{index+1}}</div>
                      </li>
                    </ul>
                  </div>
                </div> -->
                 
            </div>
           
            <div>
                <Card class="all_product" :class="relateSpaceFlag?'show_product':'none_product'">
                    <h3>所含产品</h3>
                    <div class="wrapper" ref="wrapper">
                        <ul style="padding-bottom:150px;">
                            <li class="all_li" v-for="(item,index) in productAll_data" :key="index" @click="handleProduce(item)">
                                <Card>
                                    <div class="all_box">
                                        <div class="left_img">
                                            <img :src="getImgLocalUrl(item.mainPicture+'?x-oss-process=image/resize,m_pad,h_600,w_600/quality,q_70')" alt="">
                                        </div>
                                        <div class="right_card">
                                            <div class="right_title">
                                                <!-- {{item.officialModel}}&nbsp;:&nbsp;{{item.modityName}} -->
                                                {{item.modityName}}
                                            </div>
                                            <div class="right_style">
                                                产品型号 {{item.officialModel}}
                                            </div>
                                            <div class="right_num">
                                                产品规格 {{item.skuModitySize}}mm
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </li>
                        </ul>
                    </div>
                </Card>
            </div>
        </v-touch>
    </div>
</div>
</template>

<script>
import BScroll from "better-scroll";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import $ from "jquery";
import { addFavorites } from "./api/favorites.js";
import { logScene720, logSceneDIY, logSceneVR } from "./api/main.js";
import {
  getFigureRelateSpace,
  getNewRelateSpace,
  getRelateSpace,
  getSpace,
  getXgtImages,
  getSpaceProduct,
  figureInfoRelatedCases,
  findFigureInfoProduce
} from "./api/building.js";
import VueQr from "vue-qr";
import { mapActions } from "vuex";

export default {
  name: "better_scroll",

  props: ["modityCode"],
  data() {
    return {
      showVideo: false,
      showBrickFlag:true,
      buildParamsFlag: false,
      recoverFlag: false,
      number: "",
      x: 0,
      y: 0,
      showPictureCenter: false,
      showSpaceFlag: false,
      showRightFlag: false,
      showLeftFlag: false,
      isTouchFlag: false,
      relativeShowFlag: false,
      figureShowFlag: false,
      relativeNewList: [],
      // relativeLength:'',//关联数据长度
      tempData: [], //linshi
      tempWidth: "",
      tempRelativeNewList: [],
      relativeOriginSpace: {
        originalSpace: {},
        originFlag: false
      },
      relateSpaceList: [], //案例关联换砖
      relateSpaceFlag: false,
      swiperOption: {
        // effect: 'flip',
        // grabCursor: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        pagination: {
          el: ".swiper-pagination"
        }
      },
      imageHeight: 500,
      nowImageHeight: 500,
      imageLeftWidth: 800,
      imageWidth: "",
      sceneDownloaded: true,
      show_720: true,
      show_Vr: true,
      show_qr: false,
      loading: false,
      buildingParams: {},
      spaceImages: [],
      spaceLabels: [],
      productAll_data: [],
      config: {
        //二维码参数
        src: require("../assets/local/images/logoCode.png"),
        value: "http://www.baidu.com" //显示的值、跳转的地址
      },
      complete_flag: true,
      loading_flag: false,
      vr_flag: false,
      downloadState: this.$electron.remote.getGlobal("config").DOWNLOAD_STATE
    };
  },
  mounted() {
    this.buildParamsFlag = true;

    if (this.$route.query.full_spherical_flag == 4) {
      this.show_Vr = false;
    } else if (this.$route.query.change_brick_flag == 5) {
      this.show_720 = false;
    } else if (this.$route.query.figure_flag == 6) {
      // this.figureShowFlag = true;
      this.showBrickFlag=false;
    }
    console.log(this.$route.query, 888);

    this.$nextTick(function() {
      this.imageHeight = $("#imageCard").height();
      this.imageLeftWidth = $("#imageCard").width();

      // setTimeout(() => {
      //   if (this.buildingParams.spaceId) {
      //     let relativeParams = {
      //       spaceId: this.buildingParams.spaceId
      //     };
      //     this.handleRelativeNewSpaceList(relativeParams);
      //   }
      // }, 600);
    });

    // 注：window.onresize只能在项目内触发1次
    let _this = this;
    window.onresize = function windowResize() {
      _this.nowImageHeight = $("#imageChangeEle").height();
      // 通过捕获系统的onresize事件触发我们需要执行的事件
      if (
        parseInt(_this.nowImageHeight) + 50 > parseInt(_this.imageHeight) ||
        parseInt(_this.nowImageHeight) == parseInt(_this.imageHeight)
      ) {
        let changeHeight = $("#imageCard").height();
        _this.recoverFlag = true;
        $("#imageChangeEle").css("maxHeight", changeHeight);
      }
      if (_this.recoverFlag == true) {
        let changeHeight = $("#imageCard").height();
        $("#imageChangeEle").css("maxHeight", changeHeight);
        //  $("#imageChangeEle").css("height", changeHeight);
      }
    };
  },
  components: {
    VueQr,
    swiper,
    swiperSlide
  },
  created() {
    this.$electron.ipcRenderer.on(
      "check-scene-state-result",
      this.handleCheckSceneResult
    );
  },
  destroyed() {
    this.$electron.ipcRenderer.removeListener(
      "check-scene-state-result",
      this.handleCheckSceneResult
    );
  },
  methods: {
    closeTip() {
      this.showVideo = false;
      // var video=document.getElementById("video");
      // video.pause();
    },

    loadRelativeImgs() {
      console.log("loadRelativeImgs");
      this.relativeNewList.forEach(item => {
        let img = new Image();
        img.src = this.getImgLocalUrl(
          this.getResizeImageUrl(item.imageUrl, 0, 80)
        );
      });
    },

    getResizeImageUrl(imageUrl, w, q) {
      if (!imageUrl) return;
      imageUrl = imageUrl.replace(
        /pic.oceano.com.cn/,
        "oceano-osnhome.oss-cn-hangzhou.aliyuncs.com"
      );
      // imageUrl = imageUrl.replace(
      //     /center.oceano.com.cn/,
      //     "oceano-center.oss-cn-hangzhou.aliyuncs.com"
      // );
      let param = "?x-oss-process=image";
      if (w > 0) {
        param += "/resize,m_fixed,w_" + w;
      }
      if (q > 0) {
        param += "/quality,q_" + q;
      }

      // return imageUrl + "?x-oss-process=image/resize,m_fixed,w_1000/quality,q_70";
      // return imageUrl + "?x-oss-process=image/quality,q_80";
      return imageUrl + param;
    },

    // 横轴初始化
    relativeLineScroll() {
      // 动态设置宽度
      let width = this.width();
      this.tempWidth = width;
      this.$refs.li1.style.width = width + "px";
      //  this.$refs.li2.style.width = width + "px";
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.personWrap, {
            startX: 0,
            click: true,
            scrollX: true,
            scrollY: false,
            bounce: false
          });
        } else {
          this.scroll.refresh();
        }

        this.scroll.on("touchEnd", pos => {
          if (this.isTouchFlag == true) {
          } else {
            this.x = this.scroll.x;
            if (this.x < 0) {
              if (Math.abs(this.x) < this.tempWidth - this.imageWidth - 100) {
                this.showRightFlag = true;
                this.showLeftFlag = false;
                this.relativeNewList = this.tempRelativeNewList;
              } else {
                this.showRightFlag = false;
                this.showLeftFlag = true;
              }
            } else {
              this.showLeftFlag = false;
              this.showRightFlag = true;
            }
          }
        });
      });
    },
    hanldeColor(dataImageUrl) {
      let otherProduceArr = this.tempRelativeNewList;
      let temp = [];
      // console.log("dataImageUrl:", dataImageUrl);
      for (var i = 0; i < otherProduceArr.length; i++) {
        // console.log("otherProduceArr:", otherProduceArr[i].imageUrl);

        // if (dataImageUrl == otherProduceArr[i].imageUrl) {
        //   let obj = {};
        //   obj.spaceId = otherProduceArr[i].spaceId;
        //   obj.imageUrl = otherProduceArr[i].imageUrl;
        //   obj.spaceName = otherProduceArr[i].spaceName;
        //   obj.styleName = otherProduceArr[i].styleName;
        //   obj.spaceArea = otherProduceArr[i].spaceArea;
        //   obj.showColorFlag = true;
        //   temp.push(obj);
        // } else {
        //   let obj = {};
        //   obj.spaceId = otherProduceArr[i].spaceId;
        //   obj.imageUrl = otherProduceArr[i].imageUrl;
        //   obj.spaceName = otherProduceArr[i].spaceName;
        //   obj.styleName = otherProduceArr[i].styleName;
        //   obj.spaceArea = otherProduceArr[i].spaceArea;
        //   obj.showColorFlag = false;
        //   temp.push(obj);
        // }

        if (dataImageUrl == otherProduceArr[i].imageUrl) {
          let obj = {};
          obj = otherProduceArr[i];
          obj.showColorFlag = true;
          temp.push(obj);
        } else {
          let obj = {};
          obj = otherProduceArr[i];
          obj.showColorFlag = false;
          temp.push(obj);
        }
      }
      this.relativeNewList = temp;
    },
    //获取横轴宽度
    width() {
      // 源代码
      // let wrap1 = this.$refs.li1.children;
      // let sum = 0;
      // for (var i = 0; i < wrap1.length; i++) {
      //   sum += wrap1[i].offsetHeight;
      // }
      // return sum + wrap1.length * 9 * 2;

      let wrap1Len = this.tempRelativeNewList.length;
      let sum = 0;
      for (var i = 0; i < wrap1Len; i++) {
        sum += 100;
      }
      return sum + wrap1Len * 9 * 2;
    },
    handleSpceProductList(params) {
      if (this.$route.query.figure_flag == 6) {
        //实景图关联产品
        findFigureInfoProduce(params)
          .then(resp => {
            if (resp.data.code == 200 && resp.data.data) {
              this.productAll_data = resp.data.data;
            }
          })
          .catch(() => {});
      } else {
        getSpaceProduct(params).then(resp => {
          if (resp.data.code == 200 && resp.data.data) {
            this.productAll_data = resp.data.data.spaceProductList;
          }
          //  this.spinShow = false;
        });
      }
    },
    // 新的
    handleRelativeNewSpaceList(params) {
      if (this.$route.query.figure_flag == 6) {
        getFigureRelateSpace(params).then(res => {
        
          if (res.data.code == 200) {
            if (res.data.data.length != 0) {
              this.relativeShowFlag = true;
              this.tempRelativeNewList = res.data.data;

              // this.relativeLength=this.tempRelativeNewList.length;//数据长度
              this.hanldeColor(this.buildingParams.imageUrl);
              setTimeout(() => {
                this.relativeLineScroll();
              }, 100);
            }
          }
        });
      } else {
        getNewRelateSpace(params).then(res => {
          if (res.data.code == 200) {
            if (res.data.data.length != 0) {
              this.relativeShowFlag = true;
              this.tempRelativeNewList = res.data.data;

              // this.relativeLength=this.tempRelativeNewList.length;//数据长度
              this.hanldeColor(this.buildingParams.imageUrl);
              setTimeout(() => {
                this.relativeLineScroll();
              }, 100);
            }
          }
        });
      }
      // getNewRelateSpace(params).then(res => {
      //   if (res.data.code == 200) {
      //     if (res.data.data.length != 0) {
      //       this.relativeShowFlag = true;
      //       this.tempRelativeNewList = res.data.data;

      //       // this.relativeLength=this.tempRelativeNewList.length;//数据长度
      //       this.hanldeColor(this.buildingParams.imageUrl);
      //       setTimeout(() => {
      //         this.relativeLineScroll();
      //       }, 100);

      //     }
      //   }
      // });
    },
    handleShowSpace() {
      this.showSpaceFlag = true;
      // setTimeout(() => {
      //   this.relativeLineScroll();
      // }, 100);
      this.$nextTick(function() {
        this.imageWidth = $("#imageCard").width();

        this.relativeLineScroll();
        this.handleload();
        this.hanldeColor(this.buildingParams.imageUrl);
      });
    },
    handleShowVideo() {
      this.showVideo = true;
    },
    handleload() {
      let boxWidth = this.imageWidth;
      let imgWidth = 100;

      // console.log(this.tempWidth, "tempWidth");
      // console.log(this.imageWidth, "imageWidth");
      if (this.tempWidth < boxWidth) {
        this.showPictureCenter = false;
      } else {
        this.showPictureCenter = true;
        this.relativeLineScroll();
      }

      if (this.tempWidth > boxWidth) {
        this.showRightFlag = true;
        this.isTouchFlag = false;
        this.number = parseInt(boxWidth / imgWidth);

        this.tempData = this.tempRelativeNewList.slice(0, this.number);
      } else {
        this.isTouchFlag = true;
        this.tempData = this.tempRelativeNewList;
      }
      this.relativeNewList = this.tempData;
    },
    handleCloseSpace() {
      this.showSpaceFlag = false;
      this.showRightFlag = false;
      this.showLeftFlag = false;
    },
    handleChangeRelativeSpace(data) {
      
      this.buildParamsFlag = false;
      this.recoverFlag = false;
      if (this.$route.query.figure_flag == 6) {//不用这个
        let params = {
          spaceId: data.spaceId
        };
        this.handelChageHeight();
        this.handleSpceProductList({ spaceId: data.spaceId });

        this.buildingParams= data;
        this.buildingParams.spaceId=data.programmeId;
        this.buildingParams.spaceName=data.buildingName;

        this.hanldeColor(this.buildingParams.imageUrl);
      } else {
        let params = {
          spaceId: data.spaceId
        };
        this.handelChageHeight();
        this.handleSpceProductList({ spaceId: data.spaceId });

        this.buildingParams = data;
        this.hanldeColor(this.buildingParams.imageUrl);
      }
      // let params = {
      //   spaceId: data.spaceId
      // };
      // this.handelChageHeight();
      // this.handleSpceProductList({ spaceId: data.spaceId });

      // this.buildingParams = data;
      // this.hanldeColor(this.buildingParams.imageUrl);
    },
    handelChageHeight() {
      let _this = this;
      _this.nowImageHeight = $("#imageChangeEle").height();
      // 通过捕获系统的onresize事件触发我们需要执行的事件
      if (parseInt(_this.nowImageHeight) == parseInt(_this.imageHeight)) {
        let changeHeight = $("#imageCard").height();
        _this.recoverFlag = true;
        $("#imageChangeEle").css("maxHeight", changeHeight);
      }
      if (_this.recoverFlag == true) {
        let changeHeight = $("#imageCard").height();
        $("#imageChangeEle").css("maxHeight", changeHeight);
      }
    },
    // handleRelativeList(params) {
    //   getRelateSpace(params).then(res => {
    //     if (res.data.code == 200) {
    //       if (res.data.data.diySpaces.length != 0) {
    //         this.relateSpaceFlag = true;
    //       } else {
    //         this.relateSpaceFlag = false;
    //       }
    //       this.relateSpaceList = res.data.data.diySpaces;
    //       setTimeout(() => {
    //         this.relativeLineScroll();
    //       }, 100);

    //       if (res.data.data.originalSpace != null) {
    //         this.relativeOriginSpace.originalSpace =
    //           res.data.data.originalSpace;
    //         this.relativeOriginSpace.originFlag = true;
    //       } else {
    //         this.relativeOriginSpace.originalSpace = {};
    //         this.relativeOriginSpace.originFlag = false;
    //       }
    //     }
    //   });
    // },
    // handleRelativeSpaceInfo(data) {
    //   // console.log(data,8888)
    //   let params = {
    //     spaceId: data.spaceId
    //   };
    //   let relativeParams = {
    //     spaceId: data.spaceId,
    //     sceneOriginalSpace: data.sceneOriginalSpace
    //   };
    //   this.handleRelativeList(relativeParams);
    //   this.handleSpceProductList({ spaceId: data.spaceId });
    //   getSpace(params).then(resp => {
    //     if (resp.data.code == 200 && resp.data.data) {
    //       let space = resp.data.data.space;
    //       this.buildingParams = space;
    //       this.spaceImages = [space.imageUrl];
    //       if (space.imageXgtCount > 1) {
    //         if (resp.data.code == 200 && resp.data.data) {
    //           this.spaceImages = [];
    //           resp.data.data.forEach(img => {
    //             this.spaceImages.push(img.imageUrl);
    //           });
    //         }
    //       }
    //     }
    //   });
    // },
    swiperight() {
      // this.$router.go(-1);
    },
    checkSceneState() {
      this.$electron.ipcRenderer.send(
        "check-scene-state",
        this.buildingParams.ue4SceneId
      );
    },
    handleComplete(index) {
      // this.loadRelativeImgs();
      // console.log(this.complete_flag,8888888888)
      this.complete_flag = false;
      this.loading_flag = true;
      // if (index == 0) {
      //   this.complete_flag = true;
      // }
    },
    downloadScene() {
      if (this.buildingParams.ue4SceneId) {
        this.$electron.ipcRenderer.send(
          "download-scene",
          this.buildingParams.ue4SceneId
        );
        this.$Message.success("已开始下载关联场景！");
      }
    },
    handleCheckSceneResult(event, state) {
      // this.sceneDownloaded = downloaded;
      // if(state==config.DOWNLOAD_STATE.FINISHED){
      //   // this.openVr()
      //   this.$Message.success("已下载关联场景,打开vr！");
      // }else{
      //   this.openVrModal()
      // }

      switch (state) {
        case this.downloadState.FINISHED:
          // console.log('已下载，打开UE4程序')
          this.openVr();
          // this.$Message.success("已下载关联场景,打开vr！");
          break;
        case this.downloadState.RUNNING:
          console.log("正在下载");
          this.$Message.success("场景下载中,请在下载完成后重新打开！");
          break;
        case this.downloadState.WAITING:
          console.log("等待下载");
          this.$Message.success("场景下载中,请在下载完成后重新打开！");
          break;
        case "not_found":
          console.log("场景不存在");
          this.$Message.warning(
            "场景不存在或数据未同步,请重启客户端后再尝试！"
          );
          break;
        default:
          console.log("未下载，弹出提示框");
          this.openVrModal();
          break;
      }
    },
    openVr() {
      let params = {
        ue4SceneId: this.buildingParams.ue4SceneId,
        modityCode: this.modityCode,
        ue4Param: this.buildingParams.ue4Param
          ? eval("(" + this.buildingParams.ue4Param + ")")
          : ""
      };
      this.$electron.ipcRenderer.send("open-ue4-case", params);
      logSceneVR({
        spaceId: this.buildingParams.spaceId,
        ue4SceneId: this.buildingParams.ue4SceneId
      });
    },
    openVrModal() {
      this.vr_flag = true;
    },
    handleOk() {
      this.downloadScene();
      this.vr_flag = false;
    },
    handleCancle() {
      this.vr_flag = false;
    },
    handleWeb(type) {
      this.showSpin(3000);
      var param = {
        type: type,
        sceneId: "",
        spaceId: "",
        panoramaImagePath: ""
      };
      if (type == 0) {
        param.sceneId = this.buildingParams.sceneId;
        param.spaceId = this.buildingParams.spaceId;
        logSceneDIY({
          spaceId: this.buildingParams.spaceId,
          sceneId: this.buildingParams.sceneId
        });
      } else {
        
        param.panoramaImagePath = this.buildingParams.panoramaImagePath;
        param.spaceName = this.buildingParams.spaceName;
        logScene720({
          spaceId: this.buildingParams.spaceId,
          panoramaImagePath: this.buildingParams.panoramaImagePath
        });
      }
      this.$electron.ipcRenderer.send("open-webview", param);
    },
    handleFavorites(model) {
      console.log("model:空间图", model);
      console.log(this.$electron.remote.getGlobal("mac"),'空间图')
      let param = {
        mac: this.$electron.remote.getGlobal("mac"),
        entityUrl: this.getImgLocalSourceUrl(model.imageUrl),
        entityId: model.spaceId,
        entityName: model.spaceName
      };

      this.addFavorites(param);
      this.$Message.success("收藏成功");
    },
    ...mapActions("Favorites", {
      addFavorites: "addSpace" // 映射 this.addFavorites() to this.$store.dispatch('Favorites/addProduct')
    }),
    handleProduce(model) {
      this.$router.push({
        path: "/main/product_info",
        query: {
          product_flag: 1,
          modelId: model.skuModityId
        }
      });
    }
  },
  watch: {
    buildingParams: {
      //深度监听，可监听到对象、数组的变化
      handler(newVal, oldVal) {
        // if (val.imageUrl != null) {
        // console.log("b.c: " + val.c, oldVal.c); //但是这两个值打印出来却都是一样的
        // console.log("val: ",val);
        // console.log("oldVal: ",oldVal);
        // console.log('this.show_Vr:',this.show_Vr)
        // console.log('this.buildingParams.ue4SceneId:',this.buildingParams.ue4SceneId)
        // }
        // if (this.show_Vr && this.buildingParams.ue4SceneId) {
        //   console.log("check-scene-downloaded");
        //   this.$electron.ipcRenderer.send(
        //     "check-scene-downloaded",
        //     this.buildingParams.ue4SceneId
        //   );
        // }

        if (this.buildParamsFlag == true) {
          if (newVal.spaceId) {
            if (this.$route.query.figure_flag == 6) {
              console.log(newVal, 33333333333);
              let relativeParams = {
                programmeId: newVal.programmeId
              };
              this.handleRelativeNewSpaceList(relativeParams);
            } else {
              let relativeParams = {
                spaceId: newVal.spaceId
              };
              this.handleRelativeNewSpaceList(relativeParams);
            }
          }
        }
      },

      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.detail_contianer {
  padding: 20px 15px 0 15px;

  .build_top_container {
    display: flex;
    // align-items: center;
    justify-content: center;

    .build_top_left {
      width: 60%;
      height: 92vh;
      // position: relative;
      .left_card {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }
    }

    .build_top_right {
      flex: 1;

      padding-left: 35px;
      margin-top: 35px;

      display: flex;
      flex-direction: column;
      // justify-content: space-between;
      padding-bottom: 30px;

      .box_centex {
        display: flex;
        align-items: center;

        .left_contex {
          flex: 1;

          h3 {
            font-family: SimHei;
            font-weight: 700;

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
          margin-left: 10px;

          .qr_img {
            width: 60%;
            box-shadow: 0 0 11px rgba(0, 0, 0, 0.5);
          }
        }
      }

      // .star_button {
      //   background: #c59b5f;
      //   color: #fff;
      //   // width: 180px;
      //   width: 6.5vw;
      //   height: 45px;
      //   font-size: 18px;
      // }

      .other_button {
        background: #c59b5f;
        color: #fff;
        width: 149px;
        height: 36px;
        font-size: 0.8vw;
        // margin-top: 20px;
        margin-bottom: 5px;
      }
      .show_product {
        height: 43vh;
      }
      .none_product {
        height: 53.5vh;
      }
      .all_product {
        overflow-y: auto;
        margin-top: 10px;
        h3 {
          color: #313131;
          font-size: 1.6vw;
          margin-bottom: 9px;
          padding: 16px 0 0 16px;
        }

        .wrapper {
          width: 100%;
          height: 40vh;
          background: #fff;
          padding: 16px;
          position: relative;

          .all_li {
            margin-bottom: 15px;
            list-style-type: none;
            cursor: pointer;

            .all_box {
              display: flex;
              padding: 20px;
              .left_img {
                height: 88px;
                width: 88px;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                  width: auto;
                  height: auto;
                  max-width: 100%;
                  max-height: 100%;
                }
              }

              .right_card {
                flex: 1;
                margin-left: 10px;
                display: flex;
                flex-direction: column;

                justify-content: space-between;

                .right_title {
                  color: #474747;
                  font-size: 20px;
                  //  font-family: SimHei;
                  margin-bottom: 8px;
                }

                .right_style,
                .right_num {
                  font-family: SimHei;
                  font-size: 18px;
                  color: #6b6968;
                }
              }
            }
          }
        }
      }
    }
  }
}

.all_button {
  display: flex;
  height: 76px;

  .button_margin {
    margin-right: 15px;
  }
}

.button_box {
  // width: 170px;
  // position: relative;
  // margin: 15px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6.5vw;
  background: #c59b5f;
  // height: 45px;
  height: 4vh;
  font-size: 0.9vw;
  border-radius: 5px;
  color: #fff;
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

.ivu-card-body {
  padding: 0px !important;
}

.h_name {
  word-wrap: normal;
  word-break: break-all;
}

.title_vr {
  padding: 30px 0;
  font-size: 24px;
  color: #333333;
  font-family: SimHei;
}
.read_down {
  display: flex;
  justify-content: space-between;

  .read_button {
    width: 156px;
    height: 48px;
    font-size: 18px;
    font-family: SimHei;
    background-color: #c59b5f;
    color: #fff;
  }
  .read_color {
    background-color: #eee;
    color: #555;
  }
}
.swiper-button-prev {
  background-image: url("~@/assets/local/images/left_button.png") !important;
  left: 2px;
}
.swiper-button-next {
  background-image: url("~@/assets/local/images/right_button.png") !important;
  right: 2px;
}

.relateSpace {
  width: 35vw;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  .relateSpace_item {
    cursor: pointer;
    width: 112px;
    height: 112px;
    margin-right: 10px;
    display: inline-block;
    position: relative;
    border: 3px solid #aaa;
    border-bottom: none;
    　　 img {
      width: 100%;
      height: 100%;
    }
    .text_bottom {
      position: absolute;
      bottom: 0;
      text-align: center;
      width: 100%;
      height: 26px;
      font-size: 20px;
      color: #fff;
      background: rgba(0, 0, 0, 0.6);
    }
  }
  .originSpace {
    border-color: #c59b5f;
  }
}

// 横向滚动
// .box {

//   width: 37vw;
//   overflow: hidden;
// }
// .person-wrap {
//   overflow: hidden;
//   .person-list {
//     cursor: pointer;
//     list-style-type: none;
//     display: flex;
//     .person-item {
//       width: 112px;
//       height: 112px;
//       white-space: nowrap;
//       border: 3px solid #aaa;
//       border-bottom: none;
//       margin-right: 10px;
//       position: relative;
//       img {
//         width: 100%;
//         height: 100%;
//       }
//       .text_bottom {
//         position: absolute;
//         bottom: 0;
//         text-align: center;
//         width: 100%;
//         height: 26px;
//         font-size: 20px;
//         color: #fff;
//         background: rgba(0, 0, 0, 0.6);
//       }
//     }
//     .originSpace {
//       border-color: #c59b5f;
//     }
//   }
// }

.relative_box {
  // height: 150px;
  padding: 10px 0;
  background: rgba(0, 0, 0, 0.2);
  width: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  bottom: 0px;
  z-index: 888888;
}
.relativeContainer {
  // margin-top: 30px;
  .relative_wrap {
    overflow: hidden;
    .relative_list {
      cursor: pointer;
      list-style-type: none;
      display: flex;
      padding-left: 25px;
      .relative_item {
        width: 100px;
        height: 100px;
        white-space: nowrap;
        border: 3px solid #fff;
        position: relative;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
        }
        // .text_bottom {
        //   position: absolute;
        //   bottom: 0;
        //   text-align: center;
        //   width: 100%;
        //   height: 26px;
        //   font-size: 20px;
        //   color: #fff;
        //   background: rgba(0, 0, 0, 0.6);
        // }
      }
    }
  }
}
.relative_center_item {
  cursor: pointer;
  list-style-type: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete_botton {
  // width: 20px;
  // height: 20px;
  width: 15px;
  height: 15px;
  position: absolute;
  right: 6px;
  z-index: 999999999;
  cursor: pointer;
  // bottom: 127px;
  bottom: 102px;
  img {
    width: 100%;
    height: 100%;
  }
}
.right_button {
  // width: 36px;
  // height: 36px;
  // position: absolute;
  // right: 0px;
  // cursor: pointer;
  // bottom: 57px;
  // z-index: 99999999;
  width: 36px;
  height: 36px;
  position: absolute;
  right: 0px;
  cursor: pointer;
  bottom: 48px;
  z-index: 99999999;
}
.left_button {
  width: 36px;
  height: 36px;
  position: absolute;
  left: 0px;
  cursor: pointer;
  bottom: 48px;
  z-index: 99999999;
}
.originRelativeSpace {
  border-color: #c59b5f !important;
}

// 弹框
.alet_container {
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999999999;
  .tip_text_container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 1);
    border: 1px;
    border: 1px;
    border-radius: 0.25rem;
    z-index: 99999;
    // width: 500px;
    padding: 8px;
    .rightClose {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 10px;
      img {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>