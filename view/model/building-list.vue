<template>
<div>
    <!-- 左侧搜索栏 -->
    <osntv-sider id="sider_main">
        <search-input slot="top" placeholder="请输入楼盘关键词" @button-click="handleSearch" v-model="queryParam.buildingName" style="padding-bottom:24px;height: 60px;"></search-input>
        <!-- 开启切换城市 -->
        <!-- <search-input  text="切换" placeholder="请输入城市编码" @button-click="changeCity" v-model="queryParam.cityId" style="margin-bottom:24px;"></search-input>    -->
                     
        <!-- <filter-box ref="filter" :title="'所在城市：' + cityName" @on-filter="handleSearchByArea" :items="areaList" itemTitleProp="areaName">
            <Icon slot='icon' type="ios-pin-outline" size='24' color='#c59b5f' />
        </filter-box> -->


         <filter-box ref="filter" :title="cityName" @on-filter="handleSearchByArea" :items="areaList" itemTitleProp="areaName">
            <Icon slot='icon' type="ios-pin-outline" size='24' color='#c59b5f' />
            <!-- <div slot="changeButtonCity" class="city_button" @click="handleCityModel">切换城市</div> -->
            
            <div slot="changeButtonCity" style="margin-top:10px" >
              <Button  @click="handleCityModel" type="primary" size="small" >切换城市</Button>
              <!-- <button class="city_button" @click="handleCityModel">切换城市</button> -->
              <Button v-if="cityId!=queryParam.cityId" @click="resetCity" type="primary" class="button" size="small" style="margin-left: 5px;">返回所在城市</Button>
            </div>
        </filter-box>
    </osntv-sider>
    <!-- 右侧搜索结果 -->
    <div style="margin-left:300px; height:100%;">
        <div ref="wrapper" class="wrapper" style="position:absolute; left:300px; right:0; top:0; bottom:0; overflow-y: hidden;">
            <div class="content" style="padding:20px 20px 0 20px;">
                <osntv-no-data v-show="noDataFlag"></osntv-no-data>
                <div v-show="!noDataFlag" class="img_wrap">
                    <div v-for="col in 4" class="img_col">
                        <div v-for="(building, index) in buildingData" v-if="index%4==col-1">
                            <div class="img_container" @click="handleGotoBuildingDetail(building.buildingId)">
                                <img @load="imageLoad" :src="getImgLocalUrl(building.imageUrl)"/>
                                <div class="name_display">{{building.buildingName}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="loading" style="text-align:center; font-size:14px; margin-bottom:50px;">加载中...</div>
                <div v-if="error" style="text-align:center; font-size:14px;">网络连接出现异常，请检查网络连接！</div>
            </div>
        </div>
    </div>

    <!-- 切换城市弹框 -->
      <div class="alet_container" v-show="showCityModel" @click="closeTip">
	   <!-- 内容 -->
        <!-- <section class="tip_text_container">
             <h3 class="headerBox">11111</h3>
            <div class="centerBox">
               33333
            </div>
            <div class="bottomBox">
                <p class="tip_text" @click="canelTip">取消</p>
               <div class="confrim" @click="closeTip">确认</div>
            </div>
        </section>
         <div class="sanjiao">
             <img src="~@/assets/local/images/sanjiao.png">
         </div> -->
      </div>

      <div v-show="showCityModel">
         <section class="tip_text_container">
            <div class="centerBox">
                <div class="headerBox">省</div>
                <ul>
                    <!-- <li v-for="(item,index) in proviceData" :key="index" @click="handleSelectProvice(item,index)" :class="index%5!=4?'line_not_end':''"><span :class="(currentProviceIndex==index ? 'selct_color' : '')">{{item.provinceName}}</span></span></li> -->
                      <li v-for="(item,index) in proviceData" :key="index" @click="handleSelectProvice(item,index)" ><span :class="(currentProviceIndex==index ? 'selct_color' : '')">{{item.provinceName}}</span></span></li>
                </ul>
            </div>
             <div class="centerBox">
                <div class="headerBox">市</div>
                <ul>
                    <!-- <li v-for="(item,index) in cityData" :key="index" @click="handleSelectCity(item,index)" :class="index%5!=4?'line_not_end':''"><span :class="(currentCityIndex==index ? 'selct_color' : '')">{{item.cityName}}</span></span></li> -->
                     <li v-for="(item,index) in cityData" :key="index" @click="handleSelectCity(item,index)"><span :class="(currentCityIndex==index ? 'selct_color' : '')">{{item.cityName}}</span></span></li>
                </ul>
            </div>
            <div class="bottomBox">
               <div class="confrim" @click="handleConfrim">确认</div>
            </div>
        </section>
         <div class="sanjiao">
             <img src="~@/assets/local/images/sanjiao.png">
         </div>
      </div>
</div>
</template>

<script>
import {
  findArea,
  findBuilding,
  findProvince,
  findCity
} from "../../components/api/building.js";
import BScroll from "better-scroll";
import OsntvSider from "../../components/osntv_sider";
import SearchInput from "../../components/search_input";
import FilterBox from "../../components/filter_box";
import OsntvNoData from "../../components/osntv_no_data";
import $ from "jquery";

export default {
  components: {
    OsntvSider,
    SearchInput,
    FilterBox,
    OsntvNoData
  },
  data() {
    return {
      x: 0,
      y: 0,
      error: false,
      cityId: this.$store.getters.loginUser.cityCode,
      queryParam: {
        page: 1, // 当前页
        rows: 50, // 每页显示多少条
        buildingName: "",
        cityId: null,
        areaId: ""
      },
      noDataFlag: false,
      loading: false,
      hasNextPage: false,
      cityName: null,
      areaList: [],
      buildingData: [],
      currentProviceIndex: -1,
      currentCityIndex: -1,
      showCityModel: false,
      showCityFlag: false,
      proviceData: [],
      cityData: [],
      firstShowCity: true,
      currentProviceCode: "", //当前省
      currentCityCode: "",
      //   selectCityName:'',
      selectPrams: {
        selectCityName: "",
        selectProviceCode: "",
        selcetCityCode: "",
        selectIndex: ""
      }
    };
  },
  mounted() {
    window.vue = this;
    this.$nextTick(() => {
      console.log($("#sider_main").width());
      let mainWith = $("#sider_main").width() + 200;
      let jiaoLeft = $("#sider_main").width() + 78;
      $(".tip_text_container").css("left", mainWith + "px");
      $(".sanjiao").css("left", jiaoLeft + "px");
    });
  },
  created() {
    let user = this.$store.getters.loginUser;
    this.queryParam.cityId = user.cityCode;
    this.currentCityCode = user.cityCode;
    this.cityName = user.cityName;
    if (this.queryParam.cityId) {
      this.fetchAreaList(this.queryParam.cityId);
    }
    this.fetchBuildingData(false);
    if (this.currentCityCode) {
      let userCityCode_substr = this.currentCityCode.substring(0, 3);
      this.currentProviceCode = this.handleGetNum(userCityCode_substr, 4);
    }

    this.handleFindProvice();
    this.handleFindCity(this.currentProviceCode);
  },
  deactivated() {
    if (this.areaList.length == 0) {
      this.fetchAreaList(this.queryParam.cityId);
    }
    this.x = this.scroll.x;
    this.y = this.scroll.y;
  },
  activated() {
    if (this.error) {
      this.fetchBuildingData(true);
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

        this.scroll.on("touchEnd", pos => {
          if (this.scroll.y - this.scroll.maxScrollY < 2000) {
            if (this.hasNextPage) {
              this.queryParam.page++;
              this.fetchBuildingData(true);
            }
          }
        });
        // this.scroll.on('pullingUp', () => {
        //     if (this.hasNextPage) {
        //         this.queryParam.page++;
        //         this.fetchBuildingData(true);
        //     }
        // });
      } else {
        this.scroll.refresh();
        this.scroll.scrollTo(this.x, this.y);
        // this.scroll.scrollTo(0, 0);
      }
    });
  },
  methods: {
    imageLoad() {
      this.scroll.refresh();
    },
    handleCurrentProvice(currentProvice) {
      for (let i = 0; i < this.proviceData.length; i++) {
        if (currentProvice == this.proviceData[i].provinceId) {
          this.currentProviceIndex = i;
        }
      }
    },
    handleCurrentCity(currentCity) {
      for (let i = 0; i < this.cityData.length; i++) {
        if (currentCity == this.cityData[i].cityId) {
          this.currentCityIndex = i;
          this.selectPrams.selectCityName = this.cityData[i].cityName;
          this.selectPrams.selcetCityCode = this.cityData[i].cityId;
          this.selectPrams.selectProviceCode = this.cityData[i].provinceId;
        }
      }
    },
    handleGetNum(num, n) {
      // var value = Array(n).join(0) + num;
      var value = num + Array(n).join(0);
      return value;
    },
    handleSelectProvice(item, index) {
      if (this.currentProviceIndex != index) {
        this.currentProviceIndex = index;
        this.currentCityIndex = -1;
        this.showCityFlag = true;
        this.handleFindCity(item.provinceId);
      } else {
        //没有换过滤条件
        console.log("不需要重新加载数据");
      }
    },
    handleSelectCity(item, index) {
      //   console.log(item, "item");
      if (this.currentCityIndex != index) {
        this.currentCityIndex = index;
        // this.selectCityName = item.cityName;
        // this.currentProviceCode = item.provinceId;
        // this.currentCityCode = item.cityId;
        // this.queryParam.cityId = item.cityId;
        this.selectPrams.selectIndex = index;
        this.selectPrams.selectCityName = item.cityName;
        this.selectPrams.selectProviceCode = item.provinceId;
        this.selectPrams.selcetCityCode = item.cityId;
      } else {
        //没有换过滤条件
        console.log("不需要重新加载数据");
      }
    },
    closeTip() {
      this.showCityModel = false;
    },
    handleConfrim() {
      this.cityName = this.selectPrams.selectCityName;
      this.currentCityIndex = this.selectPrams.selectIndex;
      this.currentProviceCode = this.selectPrams.selectProviceCode;
      this.currentCityCode = this.selectPrams.selcetCityCode;
      this.queryParam.cityId = this.selectPrams.selcetCityCode;
      this.changeCity();
      this.showCityModel = false;
    },
    resetCity() {
      let user = this.$store.getters.loginUser;
      this.queryParam.cityId = user.cityCode;
      this.currentCityCode = user.cityCode;
      this.cityName = user.cityName;
      if (this.$refs.filter) {
        this.$refs.filter.currentIndex = 0;
      }
      if (this.queryParam.cityId) {
        this.fetchAreaList(this.queryParam.cityId);
      }
      this.queryParam.areaId = "";
      this.handleSearch();
    },
    handleCityModel() {
      this.handleFindCity(this.currentProviceCode);
      //   this.handleCurrentProvice(this.currentProviceCode);
      //   this.handleCurrentCity(this.currentCityCode);
      //   this.showCityModel = true;
      setTimeout(() => {
        this.showCityModel = true;
        this.handleCurrentProvice(this.currentProviceCode);
        this.handleCurrentCity(this.currentCityCode);
      }, 300);
    },
    changeCity() {
      this.areaList = [];
      this.$refs.filter.currentIndex = 0;
      this.fetchAreaList(this.queryParam.cityId);
      this.queryParam.areaId = "";
      this.handleSearch();
    },
    fetchBuildingData(displayMore) {
      this.loading = displayMore;
      this.noDataFlag = false;

      findBuilding(this.queryParam)
        .then(resp => {
          if (resp.data.code == 200) {
            this.hasNextPage = resp.data.data.hasNextPage;
            if (!displayMore) {
              this.buildingData = [];
            }
            resp.data.data.list.forEach(item => {
              // item.imageUrl = this.getImgLocalUrl(item.imageUrl)
              this.buildingData.push(item);
            });
            if (this.buildingData.length == 0) {
              this.noDataFlag = true;
            }
            this.error = false;
          }
          this.loading = false;
          if (this.scroll) {
            this.scroll.finishPullUp();
            if (this.queryParam.page == 1) {
              this.scroll.scrollTo(0, 0);
            }
          }
        })
        .catch(err => {
          this.loading = false;
          this.error = true;
        });
    },
    fetchAreaList(cityId) {
      findArea({
        cityId
      }).then(resp => {
        this.areaList = [
          {
            areaId: "",
            areaName: "全部区域"
          }
        ];
        if (resp.data.code == 200) {
          resp.data.data.forEach(item => {
            this.areaList.push(item);
          });
        }
      });
    },
    handleFindProvice() {
      findProvince().then(res => {
        if (res.data.code == 200) {
          this.proviceData = res.data.data;
        }
      });
    },
    handleFindCity(provinceId) {
      findCity({ provinceId }).then(res => {
        if (res.data.code == 200) {
          this.cityData = res.data.data;

          if (this.cityData.length != 0) {
            this.handleCurrentCity(this.cityData[0].cityId);
          }
        }
      });
    },
    handleSearch(d) {
      this.queryParam.page = 1;
      this.queryParam.buildingName = d;
      this.fetchBuildingData(false);
    },
    handleSearchByArea(item) {
      this.queryParam.page = 1;
      this.queryParam.areaId = item.areaId;
      this.fetchBuildingData(false);
    },
    handleGotoBuildingDetail(buildingId) {
      this.$emit("goto-detail", buildingId);
    }
  }
};
</script>

<style lang="less" scoped>
.left_product {
  // box-shadow: 2px 0 3px -1px #d1d8de;

  .common_box {
    margin-top: 30px;

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

      li {
        width: 71px;
        height: 36px;
        color: #c59b5f;
        margin-right: 20px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #c59b5f;
        cursor: pointer;
        border-radius: 3px;

        .attr_color {
          background: url("~@/assets/local/images/bg_02.png") no-repeat;
          width: 69px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        span {
          font-size: 14px;
        }
      }
    }
  }
}

.area-btn {
  width: 100px;
  padding: 5px;
  margin-right: 8px;
  margin-bottom: 8px;
}

.img_wrap {
  display: flex;

  .img_col {
    flex: 1;

    .img_container {
      width: 100%;
      height: 15vw;
      cursor: pointer;
      margin-bottom: 20px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
        -moz-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
        -webkit-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
      }

      .name_display {
        position: absolute;
        left: 0;
        bottom: 0;
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

// 切换城市弹框样式
@keyframes tipMove {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

@keyframes jiaoMove {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

.alet_container {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}
.sanjiao {
  position: absolute;
  z-index: 99999;
  top: 80px;
  // left: 327px;
  //  animation: jiaoMove 0.3s;
}
.tip_text_container {
  position: absolute;
  //   top: 50%;
  //   left: 50%;
  z-index: 99999;
  top: 158px;
  left: 452px;
  margin-top: -6rem;
  margin-left: -6rem;
  max-width: 820px;
  // animation: tipMove 0.3s;
  background-color: rgba(255, 255, 255, 1);
  border: 1px;
  border: 1px;
  border-radius: 0.25rem;

  .headerBox {
    margin-right: 10px;
  }
  .centerBox {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #c59b5f;
    ul {
      display: flex;
      list-style: none;
      flex-wrap: wrap;
      li {
        padding: 0 5px;
        color: #c59b5f;
        span {
          display: block;
          width: 144px;

          overflow: hidden;
          margin-bottom: 12px;
          border: 1px solid #c59b5f;
          cursor: pointer;
          border-radius: 3px;
          text-align: center;

          padding: 4px 0;
        }
      }
    }
  }
  .bottomBox {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 15px 0;
  }

  .tip_text {
    // .sc(0.7rem,#333);
    height: 25px;
    line-height: 25px;
    text-align: center;
    background: rgb(204, 204, 204);
    cursor: pointer;
    padding: 0 0.4rem;
    width: 60px;
    border: 1px;
    border-radius: 3px;
  }
  .confrim {
    background-color: #c59b5f;
    width: 126px;
    text-align: center;
    border: 1px;
    border-radius: 3px;
    cursor: pointer;
    color: #fff;
    padding: 5px 0;
  }
}

.line_not_end {
  margin-right: 24px;
}
.selct_color {
  display: block;
  color: #fff;
  background: #c59b5f;
}
.city_button {
  background: #c59b5f;
  color: #fff;
  padding: 2px 3px;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
  width: 80px;
  margin-top: 8px;
  text-align: center;
}
</style>
