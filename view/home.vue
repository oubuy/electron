<template>
  <div>
    <swiper-lise :list='swiperSlides'></swiper-lise>
    <div class="contex_box">
      <router-link :to="{ path: '/main/product', query: { product_flag: 1}}" tag="div" class="contxt_div">
        <div><img src="~@/assets/local/images/home_product.png" alt=""></div>
        <div class="contxt_div_font">产品库</div>
      </router-link>
      <router-link :to="{ name: 'model', query: { model_flag: 2}}" tag="div" class="contxt_div">
        <div><img src="~@/assets/local/images/home_template.png" alt=""></div>
        <div class="contxt_div_font">户型库</div>
      </router-link>
       <router-link :to="{ path: '/main/figure', query: { figure_flag: 6}}" tag="div" class="contxt_div">
        <div><img src="~@/assets/local/images/figure_home.png" alt=""></div>
        <div class="contxt_div_font">实景图</div>
      </router-link>
      <router-link :to="{ path: '/main/case', query: { case_flag: 3,case_diffrentConten:true}}" tag="div" class="contxt_div">
        <div><img src="~@/assets/local/images/home_renderings.png" alt=""></div>
        <div class="contxt_div_font">效果图</div>
      </router-link>
      <router-link :to="{ path: '/main/full_spherical', query: { full_spherical_flag: 4,case_type: '720'}}" tag="div" class="contxt_div">
        <div><img src="~@/assets/local/images/home_720.png" alt=""></div>
        <div class="contxt_div_font">全景图</div>
      </router-link>
      <router-link :to="{ path: '/main/change_brick', query: { change_brick_flag: 5, case_type: 'yjhz'}}" tag="div" class="contxt_div">
        <div><img src="~@/assets/local/images/change.png" alt=""></div>
        <div class="contxt_div_font">一键换砖</div>
      </router-link>
   </div> 
    
  </div>
</template>

<script>
import swiperLise from "../components/swiper";
import $ from "jquery";
import { bannerData } from "../components/api/main.js";
export default {
  data() {
    return {
      // fileServerPort:this.$electron.remote.getGlobal("fileServerPort"),
      swiperSlides: [
        // this.getImgLocalUrl(
        //   "https://pic.oceano.com.cn/osntv/banner/banner1(3840).jpg"
        // ),
        // this.getImgLocalUrl(
        //   "https://pic.oceano.com.cn/osntv/banner/banner2(3840).jpg"
        // ),
        // this.getImgLocalUrl(
        //   "https://pic.oceano.com.cn/osntv/banner/banner3(3840).jpg"
        // )
      ]
    
    };
  },
  created() {
    this.handleBanner();
    // console.log(this.getImgLocalUrl("http://center.oceano.com.cn/build-web/20190723/20190723181315633_282.jpg"),88999988)
  },
  activated() {},
  mounted() {
    // console.log($(".contxt_div").width(), 88888);
    let contxtWidth = $(".contxt_div").width();
    if (contxtWidth > 260 || contxtWidth == 260) {
      $(".contxt_div").css("height", 260);
    } else {
      $(".contxt_div").css("height", contxtWidth);
    }
  },
  beforeMount() {
    // console.log("home.vue", "beforeMount");
    // this.swiperSlides = [
    //     this.getImgLocalUrl("https://pic.oceano.com.cn/osntv/banner/banner1(3840).jpg"),
    //     this.getImgLocalUrl("https://pic.oceano.com.cn/osntv/banner/banner2(3840).jpg"),
    //     this.getImgLocalUrl("https://pic.oceano.com.cn/osntv/banner/banner3(3840).jpg")
    //   ]
  },
  components: {
    swiperLise
  },
  methods: {
    handleBanner() {
      bannerData({}).then(res => {
      
        if (res.data.code == 200) {
          let dataArr = res.data.data;
         
          dataArr.forEach(item=>{
           let obj={
             imageUrl:this.getImgLocalUrl(item.imageUrl),
             linkUrl:item.linkUrl
           }
            this.swiperSlides.push(obj)
          })
        }
      });
    }

    // getImgLocalUrl(imgUrl){
    //   //修改图片地址为调用本地图片服务--开始
    //   // return imgUrl;
    //   return "http://localhost:"+this.fileServerPort +"/localFile?url=" + encodeURIComponent(imgUrl) + "&cT=image%2Fjpeg";
    //   //修改图片地址为调用本地图片服务--结束
    // }
  }
};
</script>
<style lang="less" scoped>
.contex_box {
  display: flex;
  align-items: center;
  // justify-content: center;
  justify-content: space-around;
  margin-top: 22px;
  height: 275px;
  .contxt_div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    // margin-right: 20px;
    // width: 18%;
    width: 15%;
    //  height: 260px;

    // height: 240px;
    background: #f8f8f9;
    box-shadow: 0px 0px 15px #d1d8de;
    cursor: pointer;
    .contxt_div_font {
      color: #013267;
      font-size: 36px;
      font-family: SimHei;
    }
    &:last-child {
      margin-right: 0px;
    }
  }
}
</style>



