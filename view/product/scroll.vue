<template>
    <div class="tabbar">
        <div class="wrapper" ref="wrapper">
            <div class="bscroll-container">
                <div class="top-tip">
                    <span class="refresh-hook">{{pulldownMsg}}</span>
                </div>
                <ul class="content">
                    <li v-for="item in data" @click="handleInfo(item)">
                        <div class="img_context">
                            <img :src="item.mainPicture" alt="">
                        </div>
                         <p>{{item.modityCode}}&nbsp;&nbsp;{{item.modityName}}</p>
                    </li>
                </ul>
                <!-- 底部提示信息 -->
                <div class="bottom-tip" v-show="showTipFlag">
                    <span class="loading-hook">{{pullupMsg}}</span>
                </div>
            </div>
        </div>

        <!-- alert提示刷新成功 -->
        <!-- <div class="alert-hook" :style="{display: alertHook}">刷新成功</div> -->
    </div>
</template>
<script>
import BScroll from "better-scroll";

const count = 1;
export default {
  data() {
    return {
      data: [],
      pulldownMsg: "下拉刷新",
      pullupMsg: "加载更多",
      formData: {
        pageSize: 20, //每页显示的条数
        pageNum: 1, //第几页  页码数
        modityName: "", //搜索楼盘名
        categoryId: "", //分类ID
        applicableStyleId: "", //风格ID
        applicableSpaceId: "", //空间ID
        colorName: "", //颜色ID
        specificationName: "" //规格ID
      },
      showTipFlag: false,
      scrollFlag: false,
      headerToken: { Authorization: "" } //token
    };
  },
  props: ["mainSeach", "mainCityObj"],
  created() {
    this.headerToken.Authorization = "Bearer " + localStorage.getItem("token");
    if (this.headerToken.Authorization) {
      this.getListInfo();
    }

    const that = this;
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        //初始化better-scroll
        probeType: 1, //1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
        click: true, //是否派发click事件        
        disableMouse: false,
        disableTouch: false
      });
      // 滑动过程中事件
      this.scroll.on("scroll", pos => {
        if (pos.y > 30) {
          this.pulldownMsg = "释放立即刷新";
        }
      });
      //滑动结束松开事件
      this.scroll.on("touchEnd", pos => {
        //上拉刷新
        if (pos.y > 30) {
        } else if (pos.y < this.scroll.maxScrollY - 30) {
          //下拉加载
          // console.log("下拉加载");

          this.pullupMsg = "加载中。。。";
          this.formData.pageNum++;
          this.scrollFlag = true;
          that.pullupMsg = "加载更多";
          this.getListInfo();
        }
      });
    });
  },
  methods: {
    // getData() {
    //   return new Promise(resolve => {
    //     //模拟数据请求
    //     setTimeout(() => {
    //       const arr = [];
    //       let count = 0;
    //       for (let i = 0; i < 40; i++) {
    //         arr.push(count++);
    //       }
    //       resolve(arr);
    //     }, 1000);
    //   });
    // },
    // refreshalert(){   //刷新成功提示
    //     this.alertHook = 'block';
    //     setTimeout(()=>{
    //         this.alertHook = 'none'
    //     },1000)
    // },
    handleInfo(data) {
      // this.$emit("goto-detail", data.skuModityId);
      this.$router.push({
        path: "/main/product_info",
        query: { product_flag: 1,modelId:data.skuModityId }
      });
    },
    getListInfo() {
      this.showTipFlag = true;
      this.$http({
        method: "get",
        url: "modity/findList",
        params: this.formData
        // headers: this.headerToken
      })
        .then(response => {
          if (response.data.code == 200) {
            if (this.scrollFlag == true) {
              if (this.data.length != 0) {
                this.data = this.data.concat(response.data.data.list);
              } else {
                this.data = response.data.data.list;
              }
              this.scrollFlag = false;
            } else {
              this.data = response.data.data.list;
            }

            this.showTipFlag = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  watch: {
    mainSeach(newValue) {
      //    console.log(newValue,'---',oldValue)
      this.formData.buildingName = newValue;
    },
    mainCityObj: {
      handler(oldValue, newValue) {
        this.formData.modityName = newValue.modityName;
        this.formData.categoryId = newValue.categoryId;
        this.formData.applicableStyleId = newValue.applicableStyleId;
        this.formData.applicableSpaceId = newValue.applicableSpaceId;
        this.formData.specificationId = newValue.specificationId;
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100vh;
  background: #fff;
  overflow: hidden;
  position: relative;
}

.content {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  li {
    position: relative;
    width: 20.5%;
    height: 15vw;
    margin: 10px;
    cursor: pointer;
    .img_context {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
      }
    }
    p {
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding-left: 20px;
      background: rgba(0, 0, 0, 0.6);
      /* color: #f5f1e5; */
      // text-align: center;
      font-size: 24px;
      color: #f9f9f9;
      border-radius: 4px;
    }
  }
}

/* 下拉、上拉提示信息 */
.top-tip {
  position: absolute;
  top: -40px;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #555;
}

.bottom-tip {
  width: 100%;
  height: 35px;
  line-height: 35px;
  text-align: center;
  color: #777;
  background: #f2f2f2;
  position: absolute;
  bottom: -35px;
  left: 0;
}

/* 全局提示信息 */
.alert-hook {
  display: none;
  position: fixed;
  top: 62px;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 35px;
  line-height: 35px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  background: rgba(7, 17, 27, 0.5);
}
</style>
