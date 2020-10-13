<template>

   <div class="tabbar">
        <div class="wrapper" ref="wrapper">
          <div class="img_box">
               <div v-for="col in 4" class="img_col" :key="col">
                <div class="img_container" v-for="(item,index) in dataList" v-if="index%4==col-1" @click="handleClick(item)" :key="index">
                    <img :src="item[itemImg]+'?x-oss-process=image/resize,m_pad,h_1000,w_1000/quality,q_70'">
                    <div class="name_display" style="z-index:200">
                      <span>{{item[itemTitle]}}</span>
                       <i @click.stop="iconClick(item)"></i>
                    </div>
                </div>
           </div>
          </div>
        </div>
    </div>
</template>
<script>
import BScroll from "better-scroll";   
export default {
  props: ["dataList", "itemTitle", "itemImg"],
  data() {
    return {
    };
  },
  created() {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        //初始化better-scroll
        probeType: 1, //1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
        disableMouse: false,
        disableTouch: false,
        click: true //是否派发click事件
      });

      this.scroll.on("touchEnd", pos => {
        //上拉刷新
        if (pos.y > 30) {
        } else if (pos.y < this.scroll.maxScrollY - 20) {
          //下拉加载
        //   this.loadNextPage();
        }
      });
    });
  },
  methods: {
    handleClick(item) {
    //   console.log("item click:", item.title);
      this.$emit("listItemClick", item);
    },
    iconClick(item){
    //   console.log("iconClick click:", item.title);
      this.$emit("iconClick", item);
    }
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 1032px;
  background: #fff;
  overflow: hidden;
  position: relative;

  .img_box {
    display: flex;
    .img_col {
      flex: 1;
      .img_container {
        width: 100%;
        cursor: pointer;
        margin-bottom: 20px;
        position: relative;

        img {
          width: 100%;
          max-height: 20vw;
          box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
          -moz-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
          -webkit-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
        }
        .name_display {
          position: absolute;
          left: 0;
          bottom: 5px;
          width: 100%;
          height: 50px;
          line-height: 50px;
          background: rgba(0, 0, 0, 0.6);
          color: #f5f1e5;
          font-size: 20px;
          // padding-left: 17px;
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          i {
            display: inline-block;
            width: 20px;
            background: url("~@/assets/local/images/delete.png") no-repeat
              center;
          }
        }
      }
    }
    .img_col + .img_col {
      margin-left: 20px;
    }
  }
}
</style>

