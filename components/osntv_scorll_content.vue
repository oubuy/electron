<template>
    <Content style="padding:24px 20px 0 20px;background: #fff;">
        <scorll-view class="wrapper" :style="wrapperStyle" :data="data" click pullup @scrollToEnd="scrollToEnd">
                <slot></slot>
        </scorll-view>        
    </Content>
</template>

<script>


import ScorllView from "./scorll_view";

export default {
    props: ["data"],  
    components: {
        ScorllView
    },  
    data() {
        return {
            wrapperHeight:0
            }
    },
    computed: {
        wrapperStyle(){
        return 'height:' + this.wrapperHeight + 'px;'
        }
    },
  mounted(){
    let titleHeight = 35, navHeight = 50, siderPaddingHeight = 24;
    var screenHeight = document.documentElement.clientHeight;
    this.wrapperHeight = screenHeight - titleHeight - navHeight - siderPaddingHeight ; //减去页面上固定高度height
    console.log('screenHeight:2222222222222222222',screenHeight)
    console.log('this.wrapperHeight:',this.wrapperHeight)
  },
  methods: {
      scrollToEnd(){
        this.$emit("scrollToEnd");
      }
  }
};
</script>
<style lang="less" scoped>
.wrapper {
    width: 100%;
    background: #fff;
    overflow: hidden;
}
</style>
