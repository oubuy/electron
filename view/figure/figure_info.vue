<template>
<div>
    <nav-menu></nav-menu>
    <div>
        <!-- <Spin v-if="spinShow" fix></Spin> -->
        <content-info ref="contentInfo"></content-info>
    </div>
</div>
</template>

<script>
import contentInfo from "./figureconmon";
import NavMenu from "../../components/nav_menu";
import {
  getSpace,
  getSpaceProduct,
  getSpaceLabels,
  getXgtImages,
  findFigureInfo,
  findFigureInfoProduce
} from "../../components/api/building.js";
import electron from "electron";
export default {
  data() {
    return {
      imageId: this.$route.query.imageId,
      spaceId: this.$route.query.spaceId,
      spinShow: false,
      modelId: this.$route.query.modelId,
      test_imgUrl: ""
    };
  },
  components: {
    NavMenu,
    contentInfo
  },
  created() {
   
    this.getData();
  },
  methods: {
    getData() {
      let params = {
        imageId: this.imageId
      };
      this.spinShow = true;
      findFigureInfo(params)
        .then(resp => {
          if (resp.data.code == 200 && resp.data.data) {
         
            let space = resp.data.data;
          
            this.$refs.contentInfo.buildingParams = space;

            if (
              resp.data.data.space.sceneId != null &&
              resp.data.data.space.sceneId != ""
            ) {
              const loginUser = electron.remote.getGlobal("loginUser");
              const IsStable =
                electron.remote.getGlobal("env") === "prod" ? "true" : "false";
              this.$refs.contentInfo.show_qr = true;
              this.$refs.contentInfo.config.value = `http://www.oceano.com.cn/control/diy?id=${
                resp.data.data.space.sceneId
              }&userId=&from=ipad&phone=${loginUser.username}&spaceId=${
                resp.data.data.space.spaceId
              }&IsStable=${IsStable}`;
            } else if (
              resp.data.data.space.panoramaImagePath != null &&
              resp.data.data.space.panoramaImagePath != ""
            ) {
              this.$refs.contentInfo.show_qr = true;
              this.$refs.contentInfo.config.value = `http://vr.oceano.com.cn:6600/lib/krpano/krpano.html?xml=examples/mvtpano/krpano_vr2.xml&html5=only&catalog=${
                resp.data.data.space.panoramaImagePath
              }`;
            }

            // space.imageUrl = this.getImgLocalUrl(space.imageUrl)
            // this.$refs.contentInfo.spaceImages = [space.imageUrl];
            // if(space.imageXgtCount > 1) {
            //     getXgtImages(params).then(resp => {
            //         if (resp.data.code == 200 && resp.data.data) {
            //             this.$refs.contentInfo.spaceImages = [];
            //             resp.data.data.forEach(img => {
            //                 this.$refs.contentInfo.spaceImages.push(img.imageUrl);
            //                 // this.$refs.contentInfo.spaceImages.push(this.getImgLocalUrl(img.imageUrl));
            //             });
            //         }
            //     });
            // }
          }
          this.spinShow = false;
        })
        .catch(() => {
          this.spinShow = false;
        });
      let spaceParams = {
        spaceId: this.spaceId
      };
      getSpaceLabels(spaceParams).then(resp => {
        if (resp.data.code == 200 && resp.data.data) {
          this.$refs.contentInfo.spaceLabels = resp.data.data;
        }
      });
      findFigureInfoProduce(spaceParams)
        .then(resp => {
            
          if (resp.data.code == 200 && resp.data.data) {
            // resp.data.data.spaceProductList.forEach(item=>{
            //     item.mainPicture = this.getImgLocalUrl(item.mainPicture)
            // })
            this.$refs.contentInfo.productAll_data =
              resp.data.data;
          }
        })
        .catch(() => {});
    }
  }
};
</script>
