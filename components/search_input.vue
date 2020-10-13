<template>
    <div style="height:36px;">
      <div style="position:relative;display:flex;align-item:center;">
		  <div style="position:absolute;right:65px;font-size:18px;height: 36px;line-height:36px;color:#808695;cursor: pointer;width: 30px;text-align: center;" @mousedown.prevent="showKeyboard">
			  <Icon type="ios-keypad" ></Icon>
		  </div>
        
        <input type="text" id="txt_Search" :placeholder="placeholder" v-model="keyword" @input="keyword=$event.target.value" @blur="handleBlur" style="height:36px;border: 1px solid #c59b5f;padding-left:6px;padding-right:16px;border-radius:4px;font-size:14px;color:#515a6e;">
        <Button  @click="buttonClick" type="primary" class="button" style="margin-left: 5px;">{{text}}</Button>
      </div>
      <div id="softkey" style="position: absolute;z-index: 10000;"></div>
      <!-- <Input id="txt_Search_parent" ref="keyword" size="large" :icon="icon" v-bind:value="value" @on-focus="test" @on-blur="virtualKeyboard.toggle('txt_Search','softkey');" @on-change="$emit('on-change', $event.target.value)" @on-click="openKeyboard" @keyup.enter.native="buttonClick" :placeholder="placeholder" class="keyword"/> -->
    </div>
</template>

<script>
import $ from "jquery";
export default {
  props: {
    placeholder: {
      type: [String, Number],
      default: "请输入关键字"
    },
    text: {
      type: [String, Number],
      default: "搜索"
    },
    icon: {
      type: String,
      default: "ios-keypad"
    },
    value: [String, Number]
  },
  // model: {
  //   prop: 'value',
  //   event: 'on-change'
  // },
  data() {
    return {
      virtualKeyboard: null,
      showKb: false,
      keyword: this.value,
      
    };
  },
  created() {
    this.virtualKeyboard = VirtualKeyboard;
  },
  mounted() {
    // this.virtualKeyboard.toggle('#txt_Search', 'softkey');
  },
  computed: {},
  methods: {
  
    openKeyboard() {
      this.$electron.ipcRenderer.send("open-sys-keyboard");
      this.$refs.keyword.focus();
    },
    buttonClick() {
      this.showKb = false;
      this.hideKeyboard();
      this.$emit("button-click", $("#txt_Search").val());
    },
    showKeyboard() {
      this.showKb = !this.showKb;
      if (this.showKb) {
        this.virtualKeyboard.toggle("#txt_Search", "softkey");
      } else {
        $("#txt_Search").blur();
        this.hideKeyboard();
      }
    },
    hideKeyboard() {
      this.virtualKeyboard.toggle("txt_Search", "softkey");
    },
    handleBlur(e) {
      this.showKb = false;
      this.hideKeyboard();
      this.keyword = e.target.value;
    }
  },
  watch: {
    value(newVal) {
      this.keyword = newVal;
    },
    keyword(newVal) {
      this.$emit("input", newVal);
    }
  }
};
</script>
<style lang="less" scoped>
.keyword {
  width: 194px;
}
.button {
  width: 54px;
  height: 36px;
  padding: 6px 10px 6px 10px;
}
/* .ivu-btn-large{
    padding: 6px 10px 6px 10px;
  } */
input::-webkit-input-placeholder {
  color: #ccc;
}
</style>
