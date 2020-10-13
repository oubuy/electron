<template>
<div class="wrapper" ref="wrapper" style="position:absolute; top:85px; left:300px; right:0; bottom:0; overflow-y: hidden;">
    <div class="content" style="padding:20px 20px 0 20px;">
        <osntv-no-data v-show="noDataFlag"></osntv-no-data>
        <div v-show="!noDataFlag" class="img_wrap">
            <div v-for="(list, col) in spaceList" :id="'img_col_' + col" class="img_col">
                <div v-for="(space, index) in list">
                 
                    <div class="img_container" @click="handleCase(space,$event)">
                        <img @load="imageLoad" :src="getImgLocalUrl(space.imageUrl)" />
                        <div class="name_display"><span>{{space.styleName}}{{space.spaceTypeName}}</span></div>
                        <div class="all_one">
                            <!-- ue4SceneId -->
                            <div v-if="hidden_case">
                                <i v-if="space.ue4SceneId"><img class="button_img" src="~@/assets/local/images/vr_one.png" alt=""></i>
                                <i v-if="space.sceneId" class="vr_one"><img class="button_img" src="~@/assets/local/images/DIY_one.png" alt=""></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="loading" style="text-align:center; font-size:14px;">加载中...</div>
        <div v-if="error" style="text-align:center; font-size:14px;">网络连接出现异常，请检查网络连接！</div>
    </div>
</div>
</template>

<script>
import BScroll from "better-scroll";
import { findSpaceByPost, findFigureData } from "./api/building.js";
import OsntvNoData from "./osntv_no_data";

export default {
  props: {
    spaceQueryParam: {
      type: Object,
      required: true
    }
  },
  components: {
    OsntvNoData
  },
  data() {
    return {
      x: 0,
      y: 0,
      reqCode: "",
      hidden_case: true,
      hasNextPage: false,
      spaceList: [new Array(), new Array(), new Array(), new Array()],
      spaceColHeight: [0, 0, 0, 0],
      loading: false,
      error: false,
      case_data: [],
      noDataFlag: false,
      formData: {
        rows: 32, //每页显示的条数
        page: 1, //第几页  页码数
        buildingName: "", //搜索楼盘名
        areaId: "", //搜索地区名
        cityId: "" //搜索城市名
      }
    };
  },
  created() {
 
    // this.fetchSpaceData();
  },
  deactivated() {
    this.x = this.scroll.x;
    this.y = this.scroll.y;
  },
  activated() {
    this.$nextTick(() => {
      if (!this.scroll) {
        // console.log('create scroll')
        this.scroll = new BScroll(this.$refs.wrapper, {
          //初始化better-scroll
          probeType: 1, //1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
          click: true, //是否派发click事件
          // wheel:true,
          // disableMouse:false
          disableMouse: false,
          disableTouch: false
          // preventDefault:false
        });

        this.scroll.on("touchEnd", pos => {
          // this.scroll.on("pullingUp", pos => {
          // console.log('this.scroll.y:', this.scroll.y)
          // console.log('this.scroll.maxScrollY:', this.scroll.maxScrollY)
          // console.log('y - maxScrollY:', this.scroll.y - this.scroll.maxScrollY)

          if (this.scroll.y - this.scroll.maxScrollY < 2000) {
            if (this.hasNextPage) {
              this.spaceQueryParam.page++;

              if (this.$route.query.figure_flag) {
                this.fetchFigureData();
              } else {
                this.fetchSpaceData();
              }
            }
          }
        });
      } else {
        // console.log('refresh scroll')
        this.scroll.refresh();
        this.scroll.scrollTo(this.x, this.y);
      }
    });
  },
  mounted() {
    if (this.$route.query.case_type == "720") {
      this.hidden_case = false;
    }
  },
  methods: {
    imageLoad() {
      this.scroll.refresh();
    },
    fetchSpaceData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.noDataFlag = false;
      findSpaceByPost(this.spaceQueryParam)
        .then(resp => {
          this.loading = false;
          if (resp.data.code == 200) {
            if (
              resp.data.msg != "查询成功" &&
              resp.data.msg != this.spaceQueryParam.reqCode
            ) {
              //校验请求编码
              return;
            }
            this.hasNextPage = resp.data.data.hasNextPage;
            if (this.spaceQueryParam.page == 1) {
              this.spaceList = [
                new Array(),
                new Array(),
                new Array(),
                new Array()
              ];
              this.spaceColHeight = [0, 0, 0, 0];

              if (resp.data.data.list.length == 0) {
                this.noDataFlag = true;
              }
            }
            this.handleSpaceImage(
              resp.data.data.list,
              0,
              new Array(),
              resp.data.msg
            );
            this.error = false;
          }

          if (this.scroll) {
            this.scroll.finishPullUp();
          }
        })
        .catch(err => {
          this.loading = false;
          this.error = true;
          console.log("network error:", err);
        });
    },
    // 实景图列表
    fetchFigureData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.noDataFlag = false;
      findFigureData(this.spaceQueryParam)
        .then(resp => {
          console.log(resp, "实景图");
          this.loading = false;
          if (resp.data.code == 200) {
            this.hasNextPage = resp.data.data.hasNextPage;
            if (this.spaceQueryParam.page == 1) {
              this.spaceList = [
                new Array(),
                new Array(),
                new Array(),
                new Array()
              ];
              this.spaceColHeight = [0, 0, 0, 0];

              if (resp.data.data.list.length == 0) {
                this.noDataFlag = true;
              }
            }
            this.handleFigureImage(resp.data.data.list, 0, new Array());
            this.error = false;
          }
          console.log(this.spaceList, "spaceListspaceList");
          if (this.scroll) {
            this.scroll.finishPullUp();
          }
        })
        .catch(err => {
          this.loading = false;
          this.error = true;
          console.log("network error:", err);
        });
    },

    getResizeImageUrl(imageUrl) {
      // if (imageUrl.indexOf("jpg") != -1) {
      //   if (!imageUrl) return;
      //   imageUrl = imageUrl.replace(
      //     /pic.oceano.com.cn/,
      //     "oceano-osnhome.oss-cn-hangzhou.aliyuncs.com"
      //   );
      //   // imageUrl = imageUrl.replace(
      //   //     /center.oceano.com.cn/,
      //   //     "oceano-center.oss-cn-hangzhou.aliyuncs.com"
      //   // );
      //   return (
      //     imageUrl + "?x-oss-process=image/resize,m_fixed,w_1000/quality,q_70"
      //   );
      // } else {
      //   return imageUrl;
      // }

      if (!imageUrl) return;
      imageUrl = imageUrl.replace(
        /pic.oceano.com.cn/,
        "oceano-osnhome.oss-cn-hangzhou.aliyuncs.com"
      );
      // imageUrl = imageUrl.replace(
      //     /center.oceano.com.cn/,
      //     "oceano-center.oss-cn-hangzhou.aliyuncs.com"
      // );
      return (
        imageUrl + "?x-oss-process=image/resize,m_fixed,w_1000/quality,q_70"
      );
    },
    //  实景图
    handleFigureImage(list, index, tempArray) {
      if (list.length < index + 1) {
        return;
      }
      // console.log(list, "shuju");
      let space = list[index];
      if (!space.imageUrl) return;
      space.imageUrl = this.getResizeImageUrl(space.imageUrl);

      // space.imageUrl = this.getImgLocalUrl(space.imageUrl);
      if (
        space.imageUrl.indexOf("mp4") != -1 ||
        space.imageUrl.indexOf("MOV") != -1 ||
        space.imageUrl.indexOf("mpg") != -1 ||
        space.imageUrl.indexOf("m4v") != -1 ||
        space.imageUrl.indexOf("webm") != -1 ||
        space.imageUrl.indexOf("mpeg") != -1
      ) {
        var self = this;
        self.handleFigureImage(list, index + 1, tempArray);
      } else {
        let img = new Image();
        img.src = space.imageUrl;
        img.onerror = function() {
          return false;
        };
        if (img.complete) {
          this.handleAddFigureImage(img, list, index, tempArray);
          this.handleFigureImage(list, index + 1, tempArray);
        } else {
          var self = this;
          img.onload = function() {
            self.handleAddFigureImage(img, list, index, tempArray);
            self.handleFigureImage(list, index + 1, tempArray);
          };
        }
      }

      // let img = new Image();
      // img.src = space.imageUrl;
      // img.onerror = function() {
      //   return false;
      // };
      // if (img.complete) {
      //   this.handleAddFigureImage(img, list, index, tempArray);
      //   this.handleFigureImage(list, index + 1, tempArray);
      // } else {
      //   var self = this;
      //   img.onload = function() {
      //     self.handleAddFigureImage(img, list, index, tempArray);
      //     self.handleFigureImage(list, index + 1, tempArray);
      //   };
      // }
    },
    handleAddFigureImage(img, list, index, tempArray) {
      let imgWidth = document.querySelector("#img_col_0").clientWidth;
      let imgHeight = img.height * imgWidth / img.width;
      tempArray.push({
        imgHeight,
        index
      });
      // if (tempArray.length == 4 || list.length - index == 1) {
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
      // }
    },

    // 其他模块
    handleSpaceImage(list, index, tempArray, reqCode) {
      if (reqCode != "查询成功" && reqCode != this.spaceQueryParam.reqCode) {
        //校验请求编码
        return;
      }
      if (list.length < index + 1) {
        return;
      }
      let space = list[index];
      if (!space.imageUrl) return;
      space.imageUrl = this.getResizeImageUrl(space.imageUrl);
      // space.imageUrl = this.getImgLocalUrl(space.imageUrl);
      let img = new Image();
      img.src = space.imageUrl;
      img.onerror = function() {
        return false;
      };
      if (img.complete) {
        this.handleAddSpaceImage(img, list, index, tempArray, reqCode);
        this.handleSpaceImage(list, index + 1, tempArray, reqCode);
      } else {
        var self = this;
        img.onload = function() {
          self.handleAddSpaceImage(img, list, index, tempArray, reqCode);
          self.handleSpaceImage(list, index + 1, tempArray, reqCode);
        };
      }
    },
    handleAddSpaceImage(img, list, index, tempArray, reqCode) {
      if (reqCode != "查询成功" && reqCode != this.spaceQueryParam.reqCode) {
        //校验请求编码
        return;
      }
      let imgWidth = document.querySelector("#img_col_0").clientWidth;
      let imgHeight = img.height * imgWidth / img.width;
      tempArray.push({
        imgHeight,
        index
      });
      if (tempArray.length == 4 || list.length - index == 1) {
        if (reqCode != "查询成功" && reqCode != this.spaceQueryParam.reqCode) {
          //校验请求编码
          return;
        }
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
    handleCase2() {
      // alert("case touch");
    },
    handleCase(space, event) {
      // console.log(event._constructed);
      // if(!event._constructed){//如果不存在这个属性,则为原生点击事件，不执行下面的函数
      //         return
      //     }
      // alert('case click')

      if (this.$route.query.case_flag) {
        this.$router.push({
          path: "/main/case_info",
          query: {
            case_flag: 3,
            spaceId: space.spaceId
          }
        });
      } else if (this.$route.query.full_spherical_flag) {
        this.$router.push({
          path: "/main/case_info",
          query: {
            full_spherical_flag: 4,
            spaceId: space.spaceId
          }
        });
      } else if (this.$route.query.change_brick_flag) {
        this.$router.push({
          path: "/main/case_info",
          query: {
            change_brick_flag: 5,
            spaceId: space.spaceId
          }
        });
      } else if (this.$route.query.figure_flag) {
        this.$router.push({
          path: "/main/figure_info",
          query: {
            figure_flag: 6,
            imageId: space.imageId,
            spaceId: space.spaceId
          }
        });
      }
    }
  }
};
</script>
<style lang="less">
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

        span {
          width: 75%;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .img_col + .img_col {
    margin-left: 20px;
  }
}

.all_one {
  position: absolute;
  z-index: 9999;
  right: 0px;
  bottom: 13px;

  i {
    display: inline-block;
    width: 26px;
    height: 26px;
    margin: 0 5px;
  }
}
</style>
