<template>
<div>
    <nav-menu></nav-menu>
    <left-content ref='leftContent' :param="spaceQueryParam" :ue4SceneName="ue4SceneName" @change-param="handleChangeQueryParam" @cancel-relation-scene="handleCancelRelationScene"></left-content>
    <water-scroll ref="waterScroll" :spaceQueryParam="spaceQueryParam"></water-scroll>
</div>
</template>

<script>
import NavMenu from "../../components/nav_menu";
import leftContent from "../../components/common_left";
import waterScroll from "../../components/water_scroll";
import {
    returnStatement
} from "babel-types";
export default {
    data() {
        return {
            spaceQueryParam: {
                spaceName: '',
                spaceTypeId: '',
                styleId: '',
                modelTypeId: '',
                caseModelArea: '',
                isYJHZ: true,
                isDIY: false,
                isUE4: false,
                page: 1,
                rows: 32,
                reqCode: '',
                ue4SceneId: '',
                ue4SceneIdsStr: ''
            },
            ue4SceneName: null,
            firstQuery: false
        };
    },
    created() {},
    activated() {
        let isRefresh = false; // 是否需要刷新数据
        if (this.$route.query.ue4SceneId && this.$route.query.ue4SceneName) {
            this.$refs.leftContent.resetFilter();
            this.spaceQueryParam.ue4SceneId = this.$route.query.ue4SceneId;
            this.ue4SceneName = this.$route.query.ue4SceneName;
            this.spaceQueryParam.page = 1;
            let query = {
                ...this.$route.query
            };
            delete query.ue4SceneId;
            delete query.ue4SceneName;
            this.$router.push({
                query
            });
            isRefresh = true;
        }

        let downloadedSceneIds = this.getDownloadedSceneIds();
        if (!this.isEqualArray(this.spaceQueryParam.ue4SceneIdsStr.split(","), downloadedSceneIds)) {
            this.spaceQueryParam.ue4SceneIdsStr = downloadedSceneIds.join(",");
            this.spaceQueryParam.page = 1;
            isRefresh = true;
        }

        if (!this.firstQuery || isRefresh) {
            this.$refs.waterScroll.fetchSpaceData();
            this.firstQuery = true;
        }
    },
    components: {
        NavMenu,
        waterScroll,
        leftContent
    },
    methods: {
        handleChangeQueryParam() {
            this.spaceQueryParam.reqCode = Math.random().toString(36).slice(-8)
            this.$refs.waterScroll.fetchSpaceData();
        },
        handleCancelRelationScene() {
            this.spaceQueryParam.ue4SceneId = '';
            this.ue4SceneName = '';
            this.$refs.waterScroll.fetchSpaceData();
        },
        getDownloadedSceneIds() {
            let downloadedScenes = this.$store.getters.downloadedScenes;
            let ids = [];
            downloadedScenes.forEach(item => {
                ids.push(item.uuid);
            });
            return ids;
        },
        isEqualArray(array1, array2) {
            if (array1.length != array2.length) {
                return false;
            }
            for (let i = 0; i < array1.length; i++) {
                let isExist = false;
                for (let j = 0; j < array2.length; j++) {
                    if (array1[i] == array2[j]) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    return false;
                }
            }
            return true;
        }
    }
};
</script>
