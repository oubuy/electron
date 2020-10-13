<template>
<div class="content">
    <div class="img_box">
        <div v-for="col in 4" class="img_col" :key="col">
            <div class="img_container" v-for="(item,index) in dataList" v-if="index%4==col-1" @click="handleClick(item)" :key="index">
                <img :src="getImgLocalUrl(item[itemImg])">
                <div class="name_display" style="z-index:200">
                    <span>{{item[itemTitle]}}</span>
                    <div>
                    <i :class="downloadState[item.downloadState]"></i>
                    <i v-if="item.downloadState==status.FINISHED||item.downloadState==status.STOPPED||item.downloadState==status.RUNNING||item.downloadState==status.WAITING" class="delete" @click.stop="iconClick(item)"></i>
                    </div>
                </div>
                <div v-if="item.downloadState==status.RUNNING||item.downloadState==status.WAITING" style="position: absolute;top: 0;z-index: 99;background: #000;width: 100%;position: absolute;height: 100%;opacity: 0.5;"></div>
                <div v-if="item.downloadState==status.RUNNING||item.downloadState==status.WAITING" style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;width:150px;height:150px;margin:auto;z-index:999">
                    <i-circle :percent="item.progress" :size="150" stroke-color="#c49b5e" trail-color="rgba(255,255,255,0.3)">
                        <!-- <div style="color:#c49b5e;text-align:center;font-size:20px">{{item.speed||0}}/s</div> -->
                        <div style="color:#c49b5e;text-align:center;font-size:20px">{{item.progress||0}}%</div>
                    </i-circle>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
  props: ["dataList", "itemTitle", "itemImg"],
  // components: {
  //   ScorllView
  // },
  data() {
    return {
      // pullup:true,
      // downloadState: ["未下载", "已暂停", "等待下载", "下载中", "已下载"]
      downloadState: [
        "no_download",
        "stop_download",
        "wait_download",
        "download_ing",
        "complete_download"
      ],
      status: this.$electron.remote.getGlobal("config").DOWNLOAD_STATE
    };
  },
  created() {},
  methods: {
    loadNextPage() {
      // console.log("loadNextPage");
      this.$emit("loadNextPage");
    },
    handleClick(item) {
      console.log("item click:", item.title);
      this.$emit("listItemClick", item);
    },
    iconClick(item) {
      //   console.log("iconClick click:", item.title);
      this.$emit("iconClick", item);
    }
  }
};
</script>

<style lang="less" scoped>
// .wrapper {
//   width: 100%;
//   height: 975px;
//   background: #fff;
//   overflow: hidden;
//   position: relative;
.content {
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
          bottom: 4px;
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
            width: 24px;
            height: 24px;
            margin-top: 13px;
          }
          .delete {
            background: url("~@/assets/local/images/delete.png") no-repeat
              center;
          }
          .no_download {
            background: url("~@/assets/local/images/l_uncomplete.png") no-repeat
              center;
          }

          .stop_download {
            background: url("~@/assets/local/images/download_stoped.png")
              no-repeat center;
          }

          .wait_download {
            background: url("~@/assets/local/images/l_loading.png") no-repeat
              center;
          }

          .download_ing {
            background: url("~@/assets/local/images/l_loading.png") no-repeat
              center;
          }

          .complete_download {
            background: url("~@/assets/local/images/l_complete.png") no-repeat
              center;
          }
          span {
            width: 75%;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    .img_col + .img_col {
      margin-left: 20px;
    }
  }
}

// }
</style>
