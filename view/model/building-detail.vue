<template>
<div ref="wrapper" class="wrapper" style="position:absolute; top:0; bottom:0; width: 100%; overflow: hidden;">
    <div class="content" style="position:relative; padding:20px;">
        <!-- 楼盘基本信息 -->
        <div>
            <div style="width: 40%; float: left;">
                <img :src="getImgLocalUrl(building.imageUrl)" style="width:100%; max-height:500px; box-shadow: 5px 5px 10px rgba(0, 0, 0, .5);"></img>
            </div>
            <div style="width: 60%; float: left; padding-left:50px;">
                <h1 style="font-size:36px; margin-top:30px; margin-bottom:50px;">{{building.buildingName}}</h1>
                <table class="detail_table">
                    <tr>
                        <td class="detail_name">开盘时间：</td>
                        <td class="detail_val">{{building.openingTime}}</td>
                    </tr>
                    <tr>
                        <td class="detail_name">交房时间：</td>
                        <td class="detail_val">{{building.buildingTime}}</td>
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
                        <td class="detail_name">楼盘特点：</td>
                        <td class="detail_val">
                            <span v-for="(label, index) in buildingLabelList" :key="index" style="margin-right:20px;">{{label.labelName}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="detail_name">物业类型：</td>
                        <td class="detail_val">{{building.propertyType}}</td>
                    </tr>
                </table>
            </div>
            <div style="clear:both;"></div>
        </div>
        <!-- 户型列表 -->
        <div style="margin-top:20px;">
            <div style="background: #c59b5f; width:150px; text-align:center; padding:5px 0; color:#FFF; font-size:28px;">户型</div>
        </div>
        <div class="selected_box">
            <ul>
                <li @click="handleQueryModel(0)"><span :class="{ selected_color: modelQueryType==0 }">全部</span></li>
                <li @click="handleQueryModel(1, 1)"><span :class="{ selected_color: modelQueryType==1 }">一室</span></li>
                <li @click="handleQueryModel(2, 2)"><span :class="{ selected_color: modelQueryType==2 }">二室</span></li>
                <li @click="handleQueryModel(3, 3)"><span :class="{ selected_color: modelQueryType==3 }">三室</span></li>
                <li @click="handleQueryModel(4, 4)"><span :class="{ selected_color: modelQueryType==4 }">四室</span></li>
                <li @click="handleQueryModel(5, null, '别墅')"><span :class="{ selected_color: modelQueryType==5 }">别墅</span></li>
                <li @click="handleQueryModel(6, null, null, null, 50)"><span :class="{ selected_color: modelQueryType==6 }">50㎡以下</span></li>
                <li @click="handleQueryModel(7, null, null, 50, 90)"><span :class="{ selected_color: modelQueryType==7 }">50㎡~90㎡</span></li>
                <li @click="handleQueryModel(8, null, null, 90, 130)"><span :class="{ selected_color: modelQueryType==8 }">90㎡~130㎡</span></li>
                <li @click="handleQueryModel(9, null, null, 130, null)"><span :class="{ selected_color: modelQueryType==9 }">130㎡以上</span></li>
            </ul>
        </div>
        <div style="margin-left:-10px;">
            <div v-for="(model, index) in modelList" :key="index" class="img_wrap">
                <div class="img_container" @click="handleGotoModelDetail(model.modelId)">
                    <img @load="imageLoad" :src="getImgLocalUrl(model.designImageUrl?model.designImageUrl:model.imageUrl)"></img>
                    <div class="name_display">
                        <span style="margin-right:50px;">{{model.modelName}}</span>
                        <span>{{model.modelArea}}㎡</span>
                    </div>
                </div>
            </div>
            <div style="clear:both;"></div>
        </div>
        <div v-if="loading" style="text-align:center; font-size:14px;">加载中...</div>
    </div>
</div>
</template>

<script>
import {
  getBuilding,
  findBuildingModel,
  getBuildingLabels
} from "../../components/api/building.js";
import BScroll from "better-scroll";

export default {
  props: {
    buildingId: {
      type: String
    },
    refresh: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      building: {},
      buildingLabelList: [],
      modelQueryType: 0,
      modelQueryParam: {
        buildingId: null,
        roomCount: null,
        propertyType: null,
        modelAreaMin: null,
        modelAreaMax: null,
        page: 1,
        rows: 50
      },
      modelList: [],
      hasNextPage: false,
      loading: false
    };
  },
  activated() {
    if (this.scroll) {
      this.scroll.scrollTo(0, 0);
    }
    if (
      this.refresh ||
      this.building == null ||
      Object.keys(this.building).length == 0
    ) {
      this.resetData();
      if (this.buildingId) {
        this.modelQueryParam.buildingId = this.buildingId;
        this.fetchData();
        this.fetchModelData(true);
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
            this.modelQueryParam.page++;
            this.fetchModelData(true);
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
    fetchData() {
      let params = {
        buildingId: this.buildingId
      };
      getBuilding(params).then(resp => {
        if (resp.data.code == 200 && resp.data.data) {
          this.building = resp.data.data;
          // this.building.imageUrl = this.getImgLocalUrl(this.building.imageUrl)
        }
      });
      getBuildingLabels(params).then(resp => {
        if (resp.data.code == 200 && resp.data.data) {
          this.buildingLabelList = resp.data.data;
        }
      });
    },
    fetchModelData(displayMore) {
      this.loading = true;
      findBuildingModel(this.modelQueryParam).then(resp => {
        if (resp.data.code == 200) {
          if (!displayMore) {
            this.modelList = [];
          }
          this.hasNextPage = resp.data.data.hasNextPage;
          resp.data.data.list.forEach(item => {
            if (item.designImageUrl) {
              item.designImageUrl = this.getResizeImageUrl(item.designImageUrl);
              // item.designImageUrl = this.getImgLocalUrl(item.designImageUrl)
            } else {
              item.imageUrl = this.getResizeImageUrl(item.imageUrl);
              // item.imageUrl = this.getImgLocalUrl(item.imageUrl)
            }
            this.modelList.push(item);
          });
        }
        this.loading = false;
        if (this.scroll) {
          this.scroll.finishPullUp();
        }
      });
    },
    getResizeImageUrl(imageUrl) {
      imageUrl = imageUrl.replace(
        /pic.oceano.com.cn/,
        "oceano-osnhome.oss-cn-hangzhou.aliyuncs.com"
      );
      // imageUrl = imageUrl.replace(/center.oceano.com.cn/, "oceano-center.oss-cn-hangzhou.aliyuncs.com");
      return (
        imageUrl + "?x-oss-process=image/resize,m_fixed,w_1000/quality,q_70"
      );
    },
    handleQueryModel(
      modelQueryType,
      roomCount,
      propertyType,
      modelAreaMin,
      modelAreaMax
    ) {
      this.modelQueryType = modelQueryType;
      this.modelQueryParam.roomCount = roomCount ? roomCount : null;
      this.modelQueryParam.propertyType = propertyType ? propertyType : null;
      this.modelQueryParam.modelAreaMin = modelAreaMin ? modelAreaMin : null;
      this.modelQueryParam.modelAreaMax = modelAreaMax ? modelAreaMax : null;
      this.modelQueryParam.page = 1;
      this.fetchModelData(false);
    },
    resetData() {
      this.building = {};
      this.buildingLabelList = [];
      this.modelQueryType = 0;
      this.modelQueryParam = {
        buildingId: null,
        roomCount: null,
        propertyType: null,
        modelAreaMin: null,
        modelAreaMax: null,
        page: 1,
        rows: 8
      };
      this.modelList = [];
      this.hasNextPage = false;
    },
    handleGotoModelDetail(modelId) {
      this.$emit("goto-model-detail", modelId, this.building);
    },
    handleBack() {
      this.$emit("back");
    }
  }
};
</script>

<style lang="less" scoped>
.detail_table {
  .detail_name {
    font-size: 24px;
    font-weight: bold;
    padding: 10px 10px 10px 0;
  }

  .detail_val {
    font-size: 24px;
    padding: 10px 0;
  }
}

.selected_box {
  margin: 20px 0 10px 0;

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

      .selected_color {
        color: #ff5a0a;
      }
    }
  }
}

.img_wrap {
  float: left;
  width: 25%;
  height: 20vw;
  padding: 10px;

  .img_container {
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
    text-align: center;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);

    img {
      max-width: 100%;
      max-height: 100%;
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
      text-align: left;
      padding-left: 20px;
    }
  }
}
</style>
