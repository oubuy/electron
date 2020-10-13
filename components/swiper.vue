<template>
  <div class="wrapper">
    <div  v-show="changeAutoplayFlag" @click="handleOnlyOneImg(list)">
      <img class="swiper-img" v-if="list[0]" :src="list[0].imageUrl" alt="">
    </div>
    <swiper v-if="list.length > 1" :options="swiperOption" v-show="!changeAutoplayFlag">
        <swiper-slide v-for="(item,index) of list" :key="item.id">
          <img class="swiper-img" :data="index" :class="show_navigation?'swiper_max':''" :src="item.imageUrl" alt="">
           <!-- <img class="swiper-img" :data="index" :class="show_navigation?'swiper_max':''" :src="item" alt=""> -->
        </swiper-slide>
      
    </swiper>
     <div class="swiper-button-prev" v-if="show_navigation" slot="button-prev"></div>
     <div class="swiper-button-next" v-if="show_navigation" slot="button-next"></div>
   
 
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import $ from "jquery";

let vm = null;
export default {
  data() {
    return {
      changeAutoplay_flag: true,
      showFlag: false,
      imgageBigLists: [],
      changeAuto: {
        delay: 6000,
        disableOnInteraction: false
      },
      swiperOption: {
        // observer: true, //修改swiper自己或子元素时，自动初始化swiper
        // observeParents: true, //修改swiper的父元素时，自动初始化swiper
        // type: 'fraction',
        speed: 300,
        loop: true,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false
        },

        grabCursor: true,
        // effect: "coverflow",
        grabCursor: true,
        setWrapperSize: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        on: {
          click: function(event) {
            vm.handleShowImage();
            vm.handleLink(event);
          },
          tap:function(event) {
            vm.handleShowImage();
            vm.handleLink(event);
          },
        }
      },

      show_navigation: this.diff
    };
  },

  props: ["list", "diff", "productPramas"],
  components: {
    swiper,
    swiperSlide
    // showImage,
  },
  created() {
    vm = this;
  },
  computed: {
    changeAutoplayFlag() {
      if (this.list.length > 1) {
        return false;
      } else {
        return true;
      }
    }
  },
  mounted() {},
  methods: {
    handleOnlyOneImg(data) {
      if (
        typeof data[0].linkUrl == "undefined" ||
        data[0].linkUrl == null ||
        data[0].linkUrl == ""
      ) {
      } else {
        localStorage.setItem("bannerLinkUrl", data[0].linkUrl);
        this.showSpin(3000);
        this.$electron.ipcRenderer.send("open-webview", { bannerFlag: true });
      }
    },
    handleLink(e) {
      let index = e.path[0].getAttribute("data");
      let currentData = this.list[index];

      if (
        typeof currentData.linkUrl == "undefined" ||
        currentData.linkUrl == null ||
        currentData.linkUrl == ""
      ) {
      } else {
        localStorage.setItem("bannerLinkUrl", currentData.linkUrl);
        this.showSpin(3000);
        this.$electron.ipcRenderer.send("open-webview", { bannerFlag: true });
      }
    },
    handleShowImage() {
      this.showFlag = true;

      this.imgageBigLists = this.list;
    },
    handleCloseShow(data) {
      vm.showFlag = data;
    }
  },
  watch: {}
};
</script>
<style scoped lang="less">
.wrapper {
  width: 100%;
  // background: #eee;
  position: relative;

  .swiper-img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;

    //   width: 100%;
    // max-width: 100%;
    // max-height: 60vh;
    // cursor: pointer;
  }
  .swiper_max {
    max-width: 600px !important;
    max-height: 600px !important;
  }
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  // max-height: 708px;
}

.swiper-button-prev {
  background-image: url("~@/assets/local/images/left_button.png") !important;
  left: 2px;
}
.swiper-button-next {
  background-image: url("~@/assets/local/images/right_button.png") !important;
  right: 2px;
}
</style>
