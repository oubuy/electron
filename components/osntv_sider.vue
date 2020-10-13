<template>
        <Sider class="sider" width="300">
          <div ref="topbar">
            <slot name="top">
            </slot>
          </div>
          <!-- <scorll-view class="wrapper" :style="wrapperStyle" click > -->
                <!-- <slot></slot> -->
          <!-- </scorll-view>   -->
          <div class="wrapper" :style="wrapperStyle">
            <slot></slot>
          </div>
        </Sider>
</template>

<script>
// import ScorllView from "./scorll_view";
export default {
  props: [],
    components: {
        // ScorllView
    },  
  data() {
    return {
        wrapperHeight:0
    };
  },
  mounted(){
    let titleHeight = 35, navHeight = 50, siderPaddingHeight = 24;
    let topbarHeight = this.$refs.topbar.offsetHeight
    var screenHeight = document.documentElement.clientHeight;
    this.wrapperHeight = screenHeight - topbarHeight - titleHeight - navHeight - siderPaddingHeight ; //减去页面上固定高度height
    console.log('topbarHeight:'+this.$refs.topbar.offsetHeight)
    console.log('screenHeight:',screenHeight)
    console.log('this.wrapperHeight:',this.wrapperHeight)
  },
  created() {
  },
  computed: {
    wrapperStyle(){
      return 'height:' + this.wrapperHeight + 'px;'
    }
  },
  methods: {
  }
};
</script>
<style lang="less" scoped>
.sider{
  background: #f9f9f9;
  padding: 24px 24px 0 24px;
  box-shadow: 5px 0 10px rgba(190, 190, 190, .8);
}
.wrapper{
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
    width:0px;
    // height:16px;
    // background-color:#F5F5F5;
}
/*定义滚动条轨道
 内阴影+圆角*/
// ::-webkit-scrollbar-track
// {
    // -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
    // border-radius:10px;
    // background-color:#F5F5F5;
// }
/*定义滑块
 内阴影+圆角*/
// ::-webkit-scrollbar-thumb
// {
    // border-radius:10px;
    // -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);
    // background-color:#c59b5f;
// }
</style>
