<template>
<div ref="wrapper" class="wrapper" style="position:absolute; top:0; bottom:0; width: 100%; overflow: hidden;">
    <div class="content" style="position:relative; padding:20px;">
        <!-- 户型基本信息 -->
        <div style="display:flex;">
            <div style="width: 40%; height:500px; text-align:center; box-shadow: 5px 5px 10px rgba(0, 0, 0, .5);" class="left_img_box">
                <img :src="getImgLocalUrl(model.designImageUrl?model.designImageUrl:model.imageUrl)" style="max-width:100%; max-height:500px;"></img>
            </div>
            <div style="width: 60%; padding-left:50px;">
                <h1 style="font-size:36px; margin-top:30px; margin-bottom:50px;">
                    <span style="margin-right:50px;">{{model.modelName}}</span><span>{{model.modelType}}</span>
                </h1>
                <table class="detail_table">
                    <tr>
                        <td class="detail_name">户型类别：</td>
                        <td class="detail_val">{{model.propertyType}}</td>
                    </tr>
                    <tr>
                        <td class="detail_name">户型面积：</td>
                        <td class="detail_val">{{model.modelArea}}㎡</td>
                    </tr>
                    <tr>
                        <td class="detail_name">装修状况：</td>
                        <td class="detail_val">{{building.decorationStatus}}</td>
                    </tr>
                    <tr>
                        <td class="detail_name">开发商：</td>
                        <td class="detail_val">{{building.buildingDevelopers}}</td>
                    </tr>
                    <tr>
                        <td class="detail_name">户型特点：</td>
                        <td class="detail_val">
                            <span v-for="(label, index) in modelLabelList" :key="index" style="margin-right:20px;">{{label.labelName}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="detail_name">户型解析：</td>
                        <td class="detail_val">{{model.modelDesc}}</td>
                    </tr>
                </table>
            </div>
        </div>
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
        <div class="img_wrap" v-if="spaceQueryParam.spaceTypeId==''&&haveLivingFlag">
            <div class="left-flow">
                <div class="first_item" v-if="firstImg.imageUrl" @click="gotoSpaceDetail(firstImg.spaceId)">
                    <img :src="getImgLocalUrl(firstImg.imageUrl)"></img>
                    <div class="name_display">{{firstImg.spaceName}}</div>
                </div>
                <div class="img_flow">
                    <div v-for="(list, col) in leftData" :id="'img_col_' + col" class="img_col">
                        <div v-for="(space, index) in list">
                            <div class="img_container" @click="gotoSpaceDetail(space.spaceId)">
                                <img :src="getImgLocalUrl(space.imageUrl)"></img>
                                <div class="name_display">{{space.spaceName}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-flow" style="margin-left: 20px;">
                <div class="img_flow">
                    <div v-for="(list, col) in rightData" :id="'img_cols_' + col" class="img_col">
                        <div v-for="(space, index) in list">
                            <div class="img_container" @click="gotoSpaceDetail(space.spaceId)">
                                <img @load="imageLoad" :src="getImgLocalUrl(space.imageUrl)"></img>
                                <div class="name_display" style="bottom: 0;">{{space.spaceName}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="img_wrap" v-else>
            <div v-for="(list, col) in spaceList" :id="'img_col_' + col" class="img_col">
                <div v-for="(space, index) in list">
                    <div class="img_container" @click="gotoSpaceDetail(space.spaceId)">
                        <img :src="getImgLocalUrl(space.imageUrl)"></img>
                        <!-- {{space.spaceName}} -->
                        <div class="name_display" style="bottom: 0;">{{space.styleName}}{{space.spaceTypeName}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="loading" style="text-align:center; font-size:14px;">加载中...</div>
    </div>
</div>
</template>

<script>
import {
  getBuildingModel,
  listSpaceType,
  listStyle,
  findSpace,
  getModelLabels,
  getBuilding
} from "../../components/api/building.js";
import BScroll from "better-scroll";

export default {
  props: {
    modelId: {
      type: String
    },
    buildingId: {
      type: String
    },
    building: {
      type: Object,
      default: {}
    },
    refresh: {
      type: Boolean,
      default: true
    }
  },
  watch: {
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
  data() {
    return {
      model: {},
      modelLabelList: [],
      spaceTypeList: [],
      styleList: [],
      spaceQueryParam: {
        modelId: null,
        spaceTypeId: "",
        styleId: "",
        isDIY: false,
        isVR: false,
        isUE4: false,
        page: 1,
        rows: 50
      },
      loading: false,
      spaceList: [new Array(), new Array(), new Array(), new Array()],
      spaceColHeight: [0, 0, 0, 0],
      leftData: [new Array(), new Array()],
      spaceColHeightLeft: [0, 0],
      rightData: [new Array(), new Array()],
      spaceColHeightRight: [0, 0],
      hasNextPage: false,
      spaceSearchType: 0,
      sceneType: null,
      firstImg: {},
      haveLivingFlag: false,
      firstImgHeight: ""
    };
  },
  created() {
    this.fetchSpaceTypeList();
    this.fetchStyleList();
  },
  activated() {
    if (this.scroll) {
      this.scroll.scrollTo(0, 0);
    }
    if (
      this.refresh ||
      this.model == null ||
      Object.keys(this.model).length == 0
    ) {
      this.resetData();
      if (this.modelId) {
        this.spaceQueryParam.modelId = this.modelId;
        this.fetchData();
        this.fetchSpaceData(false);
        if (this.building == null || Object.keys(this.building).length == 0) {
          this.fetchBuildingData();
        }
      }
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
  },
  methods: {
    imageLoad() {
    
      this.scroll.refresh();
    },
    handleBack() {
      this.$emit("back");
    },
    fetchData() {
      let params = {
        modelId: this.modelId
      };
      getBuildingModel(params).then(resp => {
        if (resp.data.code == 200 && resp.data.data) {
          this.model = resp.data.data;
          // console.log('this.model:',this.model)
          // this.model.designImageUrl = this.getImgLocalUrl(this.model.designImageUrl)
          // console.log('this.model.designImageUrl:',this.model.designImageUrl)
          // this.model.imageUrl = this.getImgLocalUrl(this.model.imageUrl)
          // console.log('this.model.imageUrl :',this.model.imageUrl )
          if (this.model != null) {
            if (this.model.designImageUrl) {
              this.model.designImageUrl = this.getResizeImageUrl(
                this.model.designImageUrl,
                1300
              );
            } else {
              this.model.imageUrl = this.getResizeImageUrl(
                this.model.imageUrl,
                1300
              );
            }
          }
        }
      });
      getModelLabels(params).then(resp => {
        if (resp.data.code == 200 && resp.data.data) {
          this.modelLabelList = resp.data.data;
        }
      });
    },
    fetchBuildingData(buildingId) {
      getBuilding({
        buildingId: this.buildingId
      }).then(resp => {
        if (resp.data.code == 200 && resp.data.data) {
          this.building = resp.data.data;
        }
      });
    },
    fetchSpaceData(displayMore) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      findSpace(this.spaceQueryParam).then(resp => {
        if (resp.data.code == 200) {
          this.hasNextPage = resp.data.data.hasNextPage;
          let list = resp.data.data.list ? resp.data.data.list : [];
          if (!displayMore) {
            this.spaceList = [
              new Array(),
              new Array(),
              new Array(),
              new Array()
            ];
            this.spaceColHeight = [0, 0, 0, 0];
            this.leftData = [new Array(), new Array()];
            this.spaceColHeightLeft = [0, 0];
            this.rightData = [new Array(), new Array()];
            this.spaceColHeightRight = [0, 0];
            this.firstImgHeight = "";
            this.firstImg = {};
          }
          if (this.spaceQueryParam.spaceTypeId) {
            this.firstImg = {};
            this.haveLivingFlag = false;
            this.handleSpaceImage(list, 0, new Array(), null);
            // this.handleFillImage(list);
          } else {
            if (
              !this.firstImg.imageUrl &&
              list.length &&
              this.spaceQueryParam.page == 1
            ) {
              this.firstImg = list[0];
              // this.firstImg.imageUrl = this.getImgLocalUrl(this.firstImg.imageUrl)
              this.haveLivingFlag = true;
            }
            if (this.spaceQueryParam.page == 1 && this.firstImg.imageUrl)
              list.splice(0, 1);
            this.handleSpaceImage(list, 0, new Array(), null);
            // this.handleFillImage(list);
          }
        }
        if (this.scroll) {
          this.scroll.finishPullUp();
        }
        this.loading = false;
      });
    },
    handleFillImage(list) {
      if (this.spaceQueryParam.spaceTypeId || !this.haveLivingFlag) {
        list.forEach(space => {
          space.imageUrl = this.getResizeImageUrl(space.imageUrl, 1000);
          let tempArr = [];
          this.spaceList.forEach(item => {
            tempArr.push(item.length);
          });
          let index = tempArr.indexOf(Math.min.apply(Math, tempArr));
          this.spaceList[index].push(space);
        });
      } else {
        list.forEach(space => {
          space.imageUrl = this.getResizeImageUrl(space.imageUrl, 1000);
          let leftCount0 = this.leftData[0].length + 2;
          let leftCount1 = this.leftData[1].length + 2;
          let rightCount0 = this.rightData[0].length;
          let rightCount1 = this.rightData[1].length;
          if (leftCount0 + leftCount1 <= rightCount0 + rightCount1) {
            if (leftCount0 <= leftCount1) {
              this.leftData[0].push(space);
            } else {
              this.leftData[1].push(space);
            }
          } else {
            if (rightCount0 <= rightCount1) {
              this.rightData[0].push(space);
            } else {
              this.rightData[1].push(space);
            }
          }
        });
      }
    },
    getResizeImageUrl(imageUrl, width) {
      imageUrl = imageUrl.replace(
        /pic.oceano.com.cn/,
        "oceano-osnhome.oss-cn-hangzhou.aliyuncs.com"
      );
      // imageUrl = imageUrl.replace(/center.oceano.com.cn/, "oceano-center.oss-cn-hangzhou.aliyuncs.com");
      return (
        imageUrl +
        "?x-oss-process=image/resize,m_fixed,w_" +
        width +
        "/quality,q_70"
      );
    },
    handleSpaceImage(list, index, tempArray, part) {
      if (list.length < index + 1) {
        return;
      }
      let space = list[index];
      space.imageUrl = this.getResizeImageUrl(space.imageUrl, 1000);
      // space.imageUrl = this.getImgLocalUrl(space.imageUrl)
      let img = new Image();
      img.src = space.imageUrl;
      img.onerror = function() {
        return false;
      };
      if (img.complete) {
        this.handleAddSpaceImage(img, list, index, tempArray, part);
        this.handleSpaceImage(list, index + 1, tempArray, part);
      } else {
        var self = this;
        img.onload = function() {
          self.handleAddSpaceImage(img, list, index, tempArray, part);
          self.handleSpaceImage(list, index + 1, tempArray, part);
        };
      }
    },
    handleAddSpaceImage(img, list, index, tempArray, part) {
      let imgWidth = document.querySelector("#img_col_0").clientWidth;
      let imgHeight = img.height * imgWidth / img.width + 20;
      let allHeightArr = [];
      tempArray.push({
        imgHeight,
        index
      });
      if (tempArray.length == 4 || list.length - index == 1) {
        if (this.spaceQueryParam.spaceTypeId || !this.haveLivingFlag) {
          // for (let i = 0; i < tempArray.length - 1; i++) {
          //     for (let j = i + 1; j < tempArray.length; j++) {
          //         if (tempArray[i].imgHeight < tempArray[j].imgHeight) {
          //             let temp = tempArray[i];
          //             tempArray[i] = tempArray[j];
          //             tempArray[j] = temp;
          //         }
          //     }
          // }
          tempArray.forEach(item => {
            let minHeightIndex = this.spaceColHeight.indexOf(
              Math.min.apply(Math, this.spaceColHeight)
            );
            this.spaceList[minHeightIndex].push(list[item.index]);
            this.spaceColHeight[minHeightIndex] += item.imgHeight;
          });
          tempArray.splice(0, tempArray.length);
        } else {
          setTimeout(() => {
            if (!this.firstImgHeight) {
              this.firstImgHeight = document.getElementsByClassName(
                "first_item"
              )[0].offsetHeight;
              this.spaceColHeightLeft[0] += this.firstImgHeight;
              this.spaceColHeightLeft[1] += this.firstImgHeight;
            }
            allHeightArr = [...this.spaceColHeightRight];
            for (let i = 0; i < 2; i++) {
              allHeightArr.push(this.spaceColHeightLeft[i]);
            }
            tempArray.forEach(item => {
              let minHeightIndex = null;
              if (!this.rightData[0].length || !this.rightData[1].length) {
                minHeightIndex = this.spaceColHeightRight.indexOf(
                  Math.min.apply(Math, this.spaceColHeightRight)
                );
                this.rightData[minHeightIndex].push(list[item.index]);
                this.spaceColHeightRight[minHeightIndex] += item.imgHeight;
              } else {
                minHeightIndex = allHeightArr.indexOf(
                  Math.min.apply(Math, allHeightArr)
                );
                if (minHeightIndex == 0 || minHeightIndex == 1) {
                  this.rightData[minHeightIndex].push(list[item.index]);
                  this.spaceColHeightRight[minHeightIndex] += item.imgHeight;
                } else if (minHeightIndex == 2 || minHeightIndex == 3) {
                  this.leftData[minHeightIndex - 2].push(list[item.index]);
                  this.spaceColHeightLeft[minHeightIndex - 2] += item.imgHeight;
                }
              }
              allHeightArr[minHeightIndex] += item.imgHeight;
            });
            tempArray.splice(0, tempArray.length);
          }, 300);
        }
      }
    },
    handleSearchSpace() {
      this.spaceQueryParam.page = 1;
      this.fetchSpaceData(false);
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
    gotoSpaceDetail(spaceId) {
      this.$router.push({
        path: "/main/case_info",
        query: {
          model_flag: 2,
          spaceId: spaceId
        }
      });
    },
    resetData() {
      this.model = {};
      this.modelLabelList = [];
      this.spaceQueryParam = {
        modelId: null,
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
      this.leftData = [new Array(), new Array()];
      this.spaceColHeightLeft = [0, 0];
      this.rightData = [new Array(), new Array()];
      this.spaceColHeightRight = [0, 0];
      this.hasNextPage = false;
      this.spaceSearchType = 0;
      this.sceneType = null;
      this.firstImgHeight = "";
      this.firstImg = {};
    }
  }
};
</script>

<style lang="less" scoped>
.left_img_box {
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  display: block;
}
.detail_table {
  .detail_name {
    font-size: 24px;
    font-weight: bold;
    padding: 10px 10px 10px 0;
    word-break: keep-all;
    white-space: nowrap;
    vertical-align: top;
  }

  .detail_val {
    font-size: 24px;
    padding: 10px 0;
    vertical-align: top;
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

.first_item {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  cursor: pointer;
  img {
    width: 100%;
  }
  .name_display {
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: rgba(0, 0, 0, 0.6);
    color: #f5f1e5;
    font-size: 20px;
    padding-left: 20px;
  }
}

.img_flow {
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
        bottom: 0px;
        width: 100%;
        height: 50px;
        line-height: 50px;
        background: rgba(0, 0, 0, 0.6);
        color: #f5f1e5;
        font-size: 20px;
        padding-left: 20px;
      }
    }
  }

  .img_col + .img_col {
    margin-left: 20px;
  }
}
.name_display {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.img_wrap img {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
}
.img_wrap {
  justify-content: space-between;
}
.left-flow,
.right-flow {
  width: 50%;
}
.ivu-checkbox-wrapper.ivu-checkbox-large {
  font-size: 24px;
  margin-left: 50px;
  vertical-align: middle;
}
</style>
