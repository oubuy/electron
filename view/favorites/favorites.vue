<template>
  <div>
    <nav-menu></nav-menu>
    <osntv-layout>
        <osntv-sider>
          <div style="height:970px;">
            <div class="left_favorites" >
              <img :src="favQrCodeUrl" width="252" height="252" >
              <!-- <img v-if="qrCodeUrl" :src="qrCodeUrl" width="252" height="252" > -->
              <!-- <vue-qr v-if="!qrCodeUrl" class="qr_img" :text="qr.url" :size="252" :margin="10" :dotScale="1" :logoScale="0.23" :logoSrc="qr.logSrc"></vue-qr> -->
              <dir>扫一扫就可以把你的收藏带回家</dir>
              <!-- <Button class="clean_button" icon="md-star-outline" @click="handelClean">清空收藏列表</Button> -->
               <div class="button_box" @click="handelClean">
                    <img class="button_img" src="~@/assets/local/images/top_right_icon.png" alt="">
                    <Button class="star_button">
                        清空收藏列表
                    </Button>
                </div>
            </div>
          </div>
        </osntv-sider>
        <osntv-content>
            <div class="contnet_head" style="display: flex;">
            <div @click="showSpace" style="width:150px">
              <div :class="spaceTabCss">
                <div class="comon_font">效果图收藏</div>
              </div>
            </div>
             <div @click="showFigure" style="width:150px" >
              <div :class="figureTabCss" style="border-right: none;border-left: none;">
                <div class="comon_font">实景图收藏</div>
              </div>
            </div>
            <div @click="showProduct" style="width:150px">
              <div :class="productTabCss">
                <div class="comon_font">产品收藏</div>
              </div>
            </div>
             
          </div>
          <div>
            <div style="height:40px;border-top:solid 1px #c49b5e;padding-top:10px">已收藏
              <span style="color:#c49b5e">{{listSize}}</span>个{{typeStr}}</div>
              <favorites-list v-show="showSpaceList" ref='space-list' @listItemClick="listItemClick" @iconClick="remove" :dataList="spaceFavoritesList" isWaterfall="true" itemTitle="entityName" itemImg='entityUrl'></favorites-list>
              <favorites-list v-show="showFigureList" ref='figure-list' @listItemClick="listItemClick" @iconClick="remove" :dataList="figureFavoritesList" isWaterfall="true" itemImg='entityUrl' itemTitle="entityName"></favorites-list>
              <favorites-list v-show="showProductList" ref='product-list' @listItemClick="listItemClick" @iconClick="remove" :dataList="productFavoritesList" itemTitle="entityName" itemImg='entityUrl'></favorites-list>
          </div>
        </osntv-content>
    </osntv-layout>
  </div>
</template>

<script>
import {
  findAllLocalFavorites,
  cleanupFavorites,
  getFavoritesSpaceId
} from "../../components/api/favorites.js";
import NavMenu from "../../components/nav_menu";
import FavoritesList from "./favorites-list";
import OsntvContent from "../../components/osntv_content";
import OsntvLayout from "../../components/osntv_layout";
import OsntvSider from "../../components/osntv_sider";
import VueQr from "vue-qr";
import axios from "axios";
// import $ from "jquery";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      // favQrCodeUrl:this.$electron.remote.getGlobal("favQrApi") + "?width=252&autoColor=true&isHyaline=true&scene=comId%3D"+this.$store.getters.loginUser.comId+"%26userId%3D"+this.$store.getters.loginUser.userId,
      favQrCodeUrl:
        this.$electron.remote.getGlobal("favQrApi") +
        "?width=252&autoColor=true&isHyaline=true&scene=" +
        this.$store.getters.loginUser.comId +
        "%2C" +
        this.$store.getters.loginUser.userId,
      listSize: 0,
      favoritesType: "",
      mac: this.$electron.remote.getGlobal("mac"),
      juKeBaoApi:
        this.$electron.remote.getGlobal("env") == "prod"
          ? "https://miniapp.busihelper.com/api-xcx-v1/qrcode/erpCollectBar"
          : "https://test.busihelper.com/api-xcx-v1/qrcode/erpCollectBar",
      // qrCodeUrl:"https://pic.oceano.com.cn/h5filesystem/vrscene/scene/CB25B9FC9FB6D675EC493376E1F7D6E8/CB25B9FC9FB6D675EC493376E1F7D6E8.jpg"
      qrCodeUrl: ""
      // ,
      // qr: {
      //   url: this.$electron.remote.getGlobal('config').baseServerPath + 'member/add-favorites?mac=' + this.$electron.remote.getGlobal('mac') + '&guiderId=' + this.$store.getters.loginUser.userId,
      //   logSrc: require("../../assets/local/images/logoCode.png")
      // }
    };
  },
  computed: {
    ...mapGetters("Favorites", [
      "spaceFavoritesList",
      "productFavoritesList",
      "figureFavoritesList"
    ]),
    qr() {
      return {
        url:
          this.$electron.remote.getGlobal("config").baseServerPath +
          "member/add-favorites?mac=" +
          this.$electron.remote.getGlobal("mac") +
          "&guiderId=" +
          this.$store.getters.loginUser.userId +
          "&agentId=" +
          this.$store.getters.loginUser.comId,
        // "&storeId=" +
        // this.$store.getters.loginUser.orgId,
        // url: this.$electron.remote.getGlobal('config').baseServerPath + 'member/add-favorites?agentId=' + this.$store.getters.loginUser.comId + '&guiderId=' + this.$store.getters.loginUser.userId,
        logSrc: require("../../assets/local/images/logoCode.png")
      };
    },
    typeStr() {
      // return this.favoritesType == "space" ? "效果图" : "产品";
      if (this.favoritesType == "space") {
        return "效果图";
      } else if (this.favoritesType == "product") {
        return "产品";
      } else {
        return "产实景图";
      }
    },
    showSpaceList() {
      return this.favoritesType == "space";
    },
    showProductList() {
      return this.favoritesType == "product";
    },
    showFigureList() {
      return this.favoritesType == "figure";
    },
    spaceTabCss() {
      return this.favoritesType == "space"
        ? "comonStyle commonStyle_on"
        : "comonStyle";
    },
    productTabCss() {
      return this.favoritesType == "product"
        ? "comonStyle commonStyle_on"
        : "comonStyle";
    },
    figureTabCss() {
      return this.favoritesType == "figure"
        ? "comonStyle commonStyle_on"
        : "comonStyle";
    }
  },
  created() {
    this.initFavorites();
    this.showSpace();
    console.log(this.figureFavoritesList, "figureFavoritesList");
    console.log("favQrCodeUrl:", this.favQrCodeUrl);
    // let user = this.$store.getters.loginUser;
    // this.resizeEle($(".left_favorites"), 120); //默认自适应，距屏幕底部80px
    //对接聚客宝后启用这个
    // this.getQrCodeUrl()
  },
  components: {
    VueQr,
    FavoritesList,
    OsntvLayout,
    OsntvContent,
    OsntvSider,
    NavMenu
  },
  mounted() {},
  watch: {
    spaceFavoritesList() {
      console.log("watch spaceFavoritesList");
      if (this.favoritesType == "space") {
        this.listSize = this.spaceFavoritesList.length;
      }
    },
    productFavoritesList() {
      console.log("watch productFavoritesList");
      if (this.favoritesType == "product") {
        this.listSize = this.productFavoritesList.length;
      }
    },
    figureFavoritesList() {
      console.log("watch figureFavoritesList");
      if (this.favoritesType == "figure") {
        this.listSize = this.figureFavoritesList.length;
      }
    }
  },
  methods: {
    getQrCodeUrl() {
      // console.log('this.$store.getters.loginUser.userId:',this.$store.getters.loginUser.userId)
      // console.log('this.$store.getters.loginUser.orgId:',this.$store.getters.loginUser.orgId)
      axios({
        method: "post",
        url: this.juKeBaoApi,
        data: {
          userErpCode: this.$store.getters.loginUser.userId,
          shopErpCode: this.$store.getters.loginUser.orgId
        }
      })
        .then(res => {
          console.log("getQrCodeUrl:", res);
          if (res.data.code === 200) {
            this.qrCodeUrl = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showSpace() {
      this.favoritesType = "space";
      this.listSize = this.spaceFavoritesList.length;
    },
    showProduct() {
      this.favoritesType = "product";
      this.listSize = this.productFavoritesList.length;
    },
    showFigure() {
      this.favoritesType = "figure";
      this.listSize = this.figureFavoritesList.length;
    },
    initFavoritesFigureSpaceId(figure) {
      let params = {
        imageId: figure.entityId
      };
      let _this=this;
      getFavoritesSpaceId(params).then(res => {
        if (res.data.code == 200) {
          let figureData = res.data.data;

          _this.$router.push({
            path: "/main/figure_info",
            query: {
              figure_flag: 6,
              spaceId: figureData.spaceId,
              imageId: figure.entityId,
            }
          });
        }
      });
    },
    initFavorites() {
      // this.cleanFavorites()
      findAllLocalFavorites({
        mac: this.$electron.remote.getGlobal("mac")
      }).then(res => {
        if (res.data.code == 200) {
          let favorites = res.data.data;
          console.log("favorites:", favorites);
          favorites.forEach(f => {
            if (f.entityType == "modity") {
              this.addProductLocal(f);
            } else if (f.entityType == "space") {
              this.addSpaceLocal(f);
            }
          });
        }
      });
    },
    ...mapActions("Favorites", [
      "clean",
      "removeSpace",
      "removeProduct",
      "addProductLocal",
      "addSpaceLocal",'removeFigure'
    ]),
    handelClean() {
      // console.log("cleanAll44444444444");
      this.clean({ mac: this.mac });
      // this.list = []
    },
    listItemClick(item) {
      // console.log('listItemClick:',item)
      if (this.favoritesType == "space") {
        this.handleSpaceClick(item);
      } else if (this.favoritesType == "product") {
        this.handleProductClick(item);
      } else if (this.favoritesType == "figure") {
        this.handleFigureClick(item);
      }
    },
    remove(item) {
      console.log("删除单个收藏:", item);
      if (this.favoritesType == "space") {
        this.removeSpace({ mac: this.mac, entityId: item.entityId });
      } else if (this.favoritesType == "product") {
        this.removeProduct({ mac: this.mac, entityId: item.entityId });
      }else if(this.favoritesType == "figure"){
         this.removeFigure({ mac: this.mac, entityId: item.entityId });
      }
    },
    handleFigureClick(figure) {
      console.log(figure, "figure");
      this.initFavoritesFigureSpaceId(figure);
    },
    handleSpaceClick(space) {
      console.log("handleSpaceClick:", space);
      this.$router.push({
        path: "/main/case_info",
        query: {
          case_flag: 3,
          spaceId: space.entityId
        }
      });
    },
    handleProductClick(product) {
      console.log("handleProductClick:", product);
      this.$router.push({
        path: "/main/product_info",
        query: { product_flag: 1, modelId: product.entityId }
      });
    },
    resizeEle(ele, isResetH) {
      var windowHeight = window.screen.height;
      this.viewHeight = windowHeight;
      this.maxHeight = windowHeight - isResetH;
    }
  }
};
</script>

<style lang="less" scoped>
.area-btn {
  width: 100px;
  padding: 5px;
  margin-right: 8px;
  margin-bottom: 8px;
}

.clean_button {
  background: #565553;
  color: #fff;
  width: 260px;
  height: 36px;
  font-size: 16px;
}

.img_wrap {
  float: left;
  width: 25%;
  height: 15vw;
  padding: 10px;

  .img_container {
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
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
      text-align: center;
    }
  }
}

// img {
//   box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
//   -moz-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
//   -webkit-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
// }

.left_favorites {
  // padding-right: 24px;
  margin-top: 300px;
  width: 100%;
  .qr_img {
    width: 100%;
  }
  // }
}

@import "../../style/mixin.less";
.contnet_head {
  // display: flex;
  // background-color: #3b3b3b;
  .comonStyle {
    border-top: 1px solid rgb(196, 155, 94);
    border-right: 1px solid rgb(196, 155, 94);
    border-left: 1px solid rgb(196, 155, 94);
    margin-right: 25px;
    cursor: pointer;
    height: 38px;
    width: 150px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    .comon_font {
      font-size: 16px; // color: #f9f9f9;
      font-family: Microsoft YaHei;
      color: #c59b5f;
      margin-left: 3px;
    }
    .common_img {
      width: 20px;
      height: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .commonStyle_on {
    background: #c59b5f;
    height: 38px;
    width: 150px;
    .comon_font {
      color: #fff;
    }
  }
}

.button_box {
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  .button_img {
    position: absolute;
    top: 11px;
    left: 51px;
  }
}
.star_button {
  background: rgba(59, 59, 59);
  height: 45px;
  font-size: 16px;
  width: 100%;
  color: #fff;
}
</style>
