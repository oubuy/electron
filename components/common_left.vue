<template>
<osntv-sider>
    <search-input slot="top" ref="searchFilter" :placeholder="tipText" @button-click="handleSpaceName" v-model="param.spaceName" style="height:60px;padding-bottom:24px;"></search-input>
    <div v-if="ue4SceneName" style="margin-bottom:15px;">
        <div class="deleteButton" @click="handleCancelRelationScene">{{ue4SceneName}}&nbsp;&nbsp;&nbsp;<span>x</span></div>
    </div>
    <filter-box ref='spaceFilter' title="空间" @on-filter="handleSpace" :items="spaceTypeList" itemTitleProp="spaceTypeName">
        <img slot='icon' src="~@/assets/local/images/left_space.png" alt="">
    </filter-box>
    <filter-box ref='styleFilter' title="风格" @on-filter="handleStyle" :items="styleList" itemTitleProp="styleName">
        <img slot='icon' src="~@/assets/local/images/left_style.png" alt="">
    </filter-box>
    <filter-box ref='modelAreaFilter' :title="text" v-show="showAreaFlag" @on-filter="handleModelArea" :items="modelAreaList" itemTitleProp="modelAreaDesc">
        <img slot='icon' src="~@/assets/local/images/left_area.png" alt="">
    </filter-box>
    <filter-box ref='yjhzFilter' v-if="case_type == 'yjhz'" title="效果" @on-filter="handleEffect" :items="effectList">
        <img slot='icon' src="~@/assets/local/images/left_renderings.png" alt="">
    </filter-box>
    <!-- 视频 -->
     <filter-box ref='videoFilter' v-if="changeText=='figure'" title="视频" @on-filter="handleVideo" :items="videoList" itemTitleProp="videoName">
        <img slot='icon' src="~@/assets/local/images/figrue_on.png" alt="">
    </filter-box>
</osntv-sider>
</template>
<script>
import {
  listSpaceType,
  listStyle,
  listSpaceModelType,
  listSpaceModelArea
} from "./api/building.js";
import OsntvSider from "./osntv_sider";
import SearchInput from "./search_input";
import FilterBox from "./filter_box";
import { stringify } from "querystring";

export default {
  props: {
    param: {
      type: Object,
      default: function() {
        return {
          spaceName: "",
          spaceTypeId: "",
          styleId: "",
          modelTypeId: "",
          caseModelArea: "",
          isDIY: false,
          isUE4: false,
          tipText:''
        };
      }
    },
    ue4SceneName: {
      type: String
    },
    changeText: {
      type: null
    }
  },
  components: {
    OsntvSider,
    SearchInput,
    FilterBox
  },
  data() {
    return {
      case_type: this.$route.query.case_type,
      spaceTypeList: [],
      styleList: [],
      modelTypeList: [],
      modelAreaList: [],
      videoList: [],
      effectList: [
        {
          val: "",
          key: "全部"
        },
        {
          val: "DIY",
          key: "DIY"
        },
        {
          val: "VR",
          key: "VR"
        }
      ],
      text:'',
      showAreaFlag:true,
      videoList:[
         {
          videoId: '',
          videoName: "全部"
        },
         {
          videoId: true,
          videoName: "有视频"
        },
        {
          videoId: false,
          videoName: "没视频"
        },
        
      ]
    };
  },
  created() {
    this.fetchSpaceTypeList();
    this.fetchStyleList();
    this.fetchModelAreaList();
    if(this.changeText=='figure'){
           this.text='面积'
             this.tipText="请输入产品型号"
           this.showAreaFlag=false;
         
    }else{
          this.text='户型'
           this.tipText="请输入效果图名称"
           this.showAreaFlag=true;
    }
  },
  activated() {
    if (this.spaceTypeList.length == 0) {
      this.fetchSpaceTypeList();
    }
    if (this.styleList.length == 0) {
      this.fetchStyleList();
    }
    if (this.modelAreaList.length == 0) {
      this.fetchModelAreaList();
    }
  },
  methods: {
    resetFilter() {
      this.$refs.spaceFilter.reset();
      this.$refs.styleFilter.reset();
      this.$refs.modelAreaFilter.reset();
      this.$refs.yjhzFilter.reset();
      // this.$refs.searchFilter.reset();

      this.param.page = 1;
      this.param.spaceName = "";
      this.param.spaceTypeId = "";
      this.param.styleId = "";
      this.param.modelTypeId = "";
      this.param.caseModelArea = "";
      this.param.isDIY = false;
      this.param.isUE4 = false;
    },
    fetchSpaceTypeList() {
      listSpaceType()
        .then(resp => {
          if (resp.data.code == 200) {
            this.spaceTypeList = [
              {
                spaceTypeId: "",
                spaceTypeName: "全部"
              }
            ];
            resp.data.data.forEach(item => {
              this.spaceTypeList.push(item);
            });

            // console.log(this.spaceTypeList, "this.spaceTypeList");
          }
        })
        .catch(err => {
          console.log("network err");
        });
    },
    fetchStyleList() {
      listStyle().then(resp => {
        if (resp.data.code == 200) {
          this.styleList = [
            {
              styleId: "",
              styleName: "全部"
            }
          ];
          resp.data.data.forEach(item => {
            this.styleList.push(item);
          });
        }
      });
    },
    fetchModelTypeList() {
      listSpaceModelType().then(resp => {
        if (resp.data.code == 200) {
          this.modelTypeList = [
            {
              modelTypeId: "",
              modelTypeName: "全部"
            }
          ];
          resp.data.data.forEach(item => {
            this.modelTypeList.push(item);
          });
        }
      });
    },
    fetchModelAreaList() {
      listSpaceModelArea().then(resp => {
        if (resp.data.code == 200) {
          this.modelAreaList = [
            {
              modelArea: "",
              modelAreaDesc: "全部"
            }
          ];
          resp.data.data.forEach(item => {
            this.modelAreaList.push(item);
          });
        }
      });
    },
    handleCancelRelationScene() {
      this.$emit("cancel-relation-scene");
    },
    handleSpaceName(d) {
      this.param.page = 1;
      this.param.spaceName = d;
       this.param.keyword = d;
      this.$emit("change-param");
    },
    handleSpace(item, index) {
     
      this.param.page = 1;
      this.param.spaceTypeId = item.spaceTypeId;
      this.$emit("change-param");
    },
    handleStyle(item, index) {
      
      this.param.page = 1;
      this.param.styleId = item.styleId;
      this.$emit("change-param");
    },
    handleModelType(item, index) {
      this.param.page = 1;
      this.param.modelTypeId = item.modelTypeId;
      this.$emit("change-param");
    },
    handleModelArea(item, index) {
      this.param.page = 1;
      this.param.caseModelArea = item.modelArea;
      this.$emit("change-param");
    },
    handleEffect(item) {
      this.param.page = 1;
      this.param.isDIY = item.val == "DIY";
      this.param.isUE4 = item.val == "VR";
      this.$emit("change-param");
    },
    handleVideo(item, index) {
        this.param.page = 1;
      this.param.hasVideo = item.videoId;
      this.$emit("change-param");
    }
  }
};
</script>

<style lang="less" scoped>
.deleteButton {
  display: inline-block;
  height: 22px;
  line-height: 22px;
  margin: 2px 4px 2px 0;
  padding: 0 8px;
  border: 1px solid #c59b5f;
  border-radius: 3px;
  background: #f7f7f7;
  font-size: 12px;
  vertical-align: middle;
  opacity: 1;
  overflow: hidden;
  cursor: pointer;
}

.ivu-icon-ios-close:before {
  content: "\F178" !important;
}
</style>
