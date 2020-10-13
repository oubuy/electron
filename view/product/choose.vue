<template>
    <div>
    <RadioGroup v-model="animal" size="large">
        <Radio label="DIY"></Radio>
        <Radio label="720全景"></Radio>
        <Radio label="VR漫游"></Radio>
    </RadioGroup>
    </div>
</template>
<script>
export default {
  data() {
    return {
     
      animal: "DIY"
    };
  }
};
</script>

<style lang="less" scoped>
  .ivu-radio-large .ivu-radio-wrapper, .ivu-radio-large.ivu-radio-wrapper{
      font-size: 28px !important;
       color: #333 !important;
  }
  .ivu-radio-wrapper{
      margin-right: 35px !important;
      &:first-child{
           margin-left: 25px !important;
      }
  }

</style>
