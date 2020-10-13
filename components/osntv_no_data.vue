<template>
<div>
        <div class="block-noResult"></div>            
        <div class="noResult_text">
          <span style="font-size:16px">{{tip}}</span>
        </div>
</div>
</template>

<script>
export default {
  props: {
      tip:{
          type:String,
          default:'没有找到符合条件的结果'
      }
  },
  created() {
  },
  computed: {
  },
  methods: {

  }
};
</script>
<style lang="less" scoped>
.block-noResult{
    margin-top: 100px;
    font-size: .15rem;
    color: #768893;
    height: 14rem;
    text-align: center;
    padding-top:2.8rem;
    background: url("~@/assets/local/images/noresult.png") no-repeat center;
    // background-size: 10.71rem 10.49rem;
}

.noResult_text{
  width: 100%;
  text-align: center;
}
</style>
