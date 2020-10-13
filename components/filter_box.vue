<template>
    <div class="filter_box">
      <div class="filter_head"><slot name='icon'><Icon type="md-color-filter" size='24' color='#c59b5f' /></slot><span>{{title}}</span></div>
      <slot name="changeButtonCity" class="changeButton"></slot>
       <!-- <div class="filter_head"><slot name='icon'><Icon type="md-color-filter" size='24' color='#c59b5f' /></slot><div class="changeCityAddress"><span>{{title}}</span><slot name="changeButtonCity"></slot></div></div> -->
      <ul class="lastFilter">
         <li v-for="(item,index) in items" :key="index" @click="handleFilter(item,index)" :class="index%3!=2?'line_not_end':''"><span :class="(currentIndex==index ? 'attr_color' : '')">{{item[itemTitleProp]}}</span></li>
       </ul>
    </div>
</template>

<script>
import $ from "jquery";

export default {
  props: {
    title: {
      type: [String, Number],
      default: "过滤"
    },
    items: {
      type: Array
    },
    itemTitleProp: {
      type: String,
      default: "key"
    }
  },
  data() {
    return {
      currentIndex: 0,
      lastIndex: 0
    };
  },
  created() {
    this.$nextTick(() => {
    
      if (this.$route.query.product_flag != 1) {
        let lastFilterUl = $(".lastFilter");
        let len = lastFilterUl.length;
        let lastBox = lastFilterUl.eq(len - 1);
        lastBox.css("paddingBottom", 90);
      }
    });
  },
  computed: {},
  methods: {
    select(index) {
      this.handleFilter(this.items[index], index);
    },
    reset() {
      this.currentIndex = 0;
      this.lastIndex = 0;
    },
    handleFilter(item, index) {
      if (this.currentIndex != index) {
        this.lastIndex = this.currentIndex;
        //换了过滤条件
        this.currentIndex = index;
        this.$emit("on-filter", item, index, this);
      } else {
        //没有换过滤条件
        console.log("不需要重新加载数据");
      }
    },
    revert() {
      this.currentIndex = this.lastIndex;
    }
  }
};
</script>
<style lang="less" scoped>
.filter_box {
  margin-top: 0px;
  .filter_head {
    line-height: 24px;
    display: flex;
    align-items: center;
    span {
      margin-left: 6px;
      color: #555;
      // font-size: 24px;
      font-size: 20px;
      display: inline-block;
    }
  }
  // .changeButton {
  //   background: #c59b5f;
  //   color: #fff;
  //   padding: 2px 3px;
  //   font-size: 12px;
  //   border-radius: 3px;
  //   cursor: pointer;
  //   width: 80px;
  //   margin-top: 8px;
  //   text-align: center;
  // }
  .changeCityAddress {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .city_button {
      background: #c59b5f;
      color: #fff;
      padding: 2px 3px;
      font-size: 12px;
      border-radius: 3px;
      cursor: pointer;
    }
  }
  ul {
    list-style-type: none;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 20px;
    li {
      width: 68px;
      height: 36px;
      color: #c59b5f;
      // margin-right: 24px;
      margin-bottom: 24px;
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
        font-size: 13px;
      }
    }
    .line_not_end {
      margin-right: 24px;
    }
  }
}
</style>
