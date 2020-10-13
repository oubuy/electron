<template>
  <div class="product_nav">
      
    <div class="nav_content">
    <router-link to="/main/home" tag="div" class="comonStyle commonWidth">
      <div class="common_img"><img src="~@/assets/local/images/nav_home.png" alt=""></div>
      <div class="comon_font">首页</div>
    </router-link>
    <router-link :to="{ path: '/main/product', query: { product_flag: 1}}" tag="div" class="commonWidth">
    <!-- <div @click="jumpProduct"> -->
      <div v-if="product_show_on_flag" class="comonStyle commonStyle_on">
        <div class="common_img"><img src="~@/assets/local/images/nav_product_on.png" alt=""></div>
        <div class="comon_font">产品库</div>
      </div>
      <div v-else class="comonStyle">
        <div class="common_img"><img src="~@/assets/local/images/nav_product.png" alt=""></div>
        <div class="comon_font">产品库</div>
      </div>
    <!-- </div> -->
    </router-link>
    <router-link :to="{ name: 'model', query: { model_flag: 2}}" tag="div" class="commonWidth">
      <div v-if="model_show_on_flag" class="comonStyle commonStyle_on">
        <div class="common_img"><img src="~@/assets/local/images/nav_template_on.png" alt=""></div>
        <div class="comon_font">户型库</div>
      </div>
      <div v-else class="comonStyle">
        <div class="common_img"><img src="~@/assets/local/images/nav_template.png" alt=""></div>
        <div class="comon_font">户型库</div>
      </div>
    </router-link>
 
   
      <router-link :to="{ path: '/main/figure', query: { figure_flag: 6}}" tag="div" class="commonWidth">
      <div v-if="figure_show_on_flag" class="comonStyle commonStyle_on">
        <div class="common_img"><img src="~@/assets/local/images/figrue.png" alt=""></div>
        <div class="comon_font">实景图</div>
      </div>
      <div v-else class="comonStyle">
        <div class="common_img"><img src="~@/assets/local/images/figrue_on.png" alt=""></div>
        <div class="comon_font">实景图</div>
      </div>
    </router-link>

    <router-link :to="{ path: '/main/case', query: { case_flag: 3, case_type: 'xgt'}}" tag="div" class="commonWidth">
      <div v-if="case_show_on_flag" class="comonStyle commonStyle_on">
        <div class="common_img"><img src="~@/assets/local/images/nav_renderings_on.png" alt=""></div>
        <div class="comon_font">效果图</div>
      </div>
      <div v-else class="comonStyle">
        <div class="common_img"><img src="~@/assets/local/images/nav_renderings.png" alt=""></div>
        <div class="comon_font">效果图</div>
      </div>
    </router-link>
    <router-link :to="{ path: '/main/full_spherical', query: { full_spherical_flag: 4, case_type: '720'}}" tag="div" class="commonWidth">
      <div v-if="fullSpherical_show_on_flag" class="comonStyle commonStyle_on">
        <div class="case_img"><img src="~@/assets/local/images/new_720_on.png" alt=""></div>
        <div class="comon_font">全景图</div>
      </div>
      <div v-else class="comonStyle">
        <div class="case_img"><img src="~@/assets/local/images/new_720_off.png" alt=""></div>
        <div class="comon_font">全景图</div>
      </div>
    </router-link>
    <router-link :to="{ path: '/main/change_brick', query: { change_brick_flag: 5, case_type: 'yjhz'}}" tag="div" class="commonWidth">
      <div v-if="changeBrick_show_on_flag" class="comonStyle commonStyle_on">
        <div class="common_img"><img src="~@/assets/local/images/nav_swich_on.png" alt=""></div>
        <div class="comon_font">一键换砖</div>
      </div>
      <div v-else class="comonStyle">
        <div class="common_img"><img src="~@/assets/local/images/nav_swich.png" alt=""></div>
        <div class="comon_font">一键换砖</div>
      </div>
    </router-link>
    <router-link :to="{ name: 'scene', query: { autoDownload: false}}" v-if="scene_show_on_flag" tag="div" class="commonWidth">
      <div class="comonStyle commonStyle_on">
        <div class="common_img"><img src="~@/assets/local/images/loading.png" alt=""></div>
        <div class="comon_font">场景下载</div>
      </div>
      <!--<div v-else class="comonStyle">
        <div class="common_img"><img src="~@/assets/local/images/nav_setting.png" alt=""></div>
        <div class="comon_font">设置</div>
      </div>-->
    </router-link>
    <router-link :to="{ name: 'favorites', }" tag="div" v-if="favorites_show_on_flag" class="commonWidth">
      <div  class="comonStyle commonStyle_on">
        <div class="common_img"><img src="~@/assets/local/images/nav_favorites.png" alt=""></div>
        <div class="comon_font">收藏夹</div>
      </div>
      <!--<div v-else class="comonStyle">
        <div class="common_img"><img src="~@/assets/local/images/nav_favorites.png" alt=""></div>
        <div class="comon_font">收藏夹</div>
      </div>-->
    </router-link>
    </div>
    <div class="backBox">
      <!-- <div class="back_tile" @click="goBack" v-if="preShowFlag">
        <img src="~@/assets/local/images/pre.png" alt="">
       </div> -->
        <div class="back_tile" @click="goBack">
        <img src="~@/assets/local/images/pre_on.png" alt="">
       </div>
        <div class="back_tile next_button" @click="handleNext" v-if="canGoForward">
        <img src="~@/assets/local/images/next_on.png" alt="">
       </div>
        <div class="back_tile next_button" v-else >
        <img src="~@/assets/local/images/next.png" alt="">
       </div>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      product_show_on_flag: false,
      model_show_on_flag: false,
      scene_show_on_flag: false, //场景下载
      case_show_on_flag: false,
      figure_show_on_flag: false,
      fullSpherical_show_on_flag: false,
      changeBrick_show_on_flag: false,
      favorites_show_on_flag: false, //收藏夹
      canGoForward: false,
      tempArr: []
    };
  },
  computed: {},
  created() {
    if (this.$route.query.product_flag == 1) {
      this.product_show_on_flag = true;
    } else if (this.$route.query.model_flag == 2) {
      this.model_show_on_flag = true;
    } else if (this.$route.name == "scene") {
      this.scene_show_on_flag = true;
    } else if (this.$route.query.case_flag == 3) {
      this.case_show_on_flag = true;
    } else if (this.$route.query.full_spherical_flag == 4) {
      this.fullSpherical_show_on_flag = true;
    } else if (this.$route.query.change_brick_flag == 5) {
      this.changeBrick_show_on_flag = true;
    } else if (this.$route.name == "favorites") {
      this.favorites_show_on_flag = true;
    } else if (this.$route.query.figure_flag == 6) {
      this.figure_show_on_flag = true;
    }

    this.canGoForward = this.$electron.remote
      .getCurrentWebContents()
      .canGoForward();
  },
  activated() {
    this.canGoForward = this.$electron.remote
      .getCurrentWebContents()
      .canGoForward();
  },
  mounted() {},
  methods: {
    goBack() {
      this.$electron.remote.getCurrentWebContents().goBack();
    },
    handleNext() {
      if (this.canGoForward) {
        this.$electron.remote.getCurrentWebContents().goForward();
      }
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
@import "../style/mixin.less";
.product_nav {
  display: flex;
  background-color: #3b3b3b;
  justify-content: space-between;
  .comonStyle {
    // margin-right: 25px;
    cursor: pointer;
    height: 50px;

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
    .case_img {
      width: 33px;
      height: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .commonStyle_on {
    background: #c59b5f;
    height: 50px;

    .comon_font {
      color: #fff;
    }
  }
  .backBox {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 40px;
    .back_tile {
      height: 50px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      color: #fff;
      font-size: 16px;
    }
    .next_button {
      margin-left: 30px;
    }
  }
}

.nav_content {
  display: flex;

  align-items: center;
  justify-content: space-around;
  // flex: 1;
}

// 自适应宽带
.commonWidth {
  width: 10rem;
}
</style>
