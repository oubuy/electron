<template>
<div>
    <nav-menu></nav-menu>
    <left-content :param="spaceQueryParam" @change-param="handleChangeQueryParam" changeText="figure"></left-content>
    <water-scroll ref="waterScroll" :spaceQueryParam="spaceQueryParam"></water-scroll>
</div>
</template>

<script>
import NavMenu from "../../components/nav_menu";
import leftContent from "../../components/common_left";
import waterScroll from "../../components/water_scroll";

export default {
  data() {
    return {
      spaceQueryParam: {
        spaceName: "",
        spaceTypeId: "",
        styleId: "",
        modelTypeId: "",
        caseModelArea: "",
        // videoId:'',//视频
        keyword:'',//搜索框
        hasVideo:'',
        isXGT: true,
        isDIY: false,
        isUE4: false,
        page: 1,
        rows: 32,
         reqCode: Math.random().toString(36).slice(-8)
      },
        firstQuery: false
    };
  }, 
  components: {
    NavMenu,
    waterScroll,
    leftContent
  },

     activated() {
        if (!this.firstQuery) {
            this.$refs.waterScroll.fetchFigureData();
            this.firstQuery = true;
        };
        	
    },
    methods: {
        handleChangeQueryParam() {
            this.$refs.waterScroll.fetchFigureData();
        },
     
    }
};
</script>
