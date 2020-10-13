<template>
<div>
    <nav-menu ref="navMenu"></nav-menu>
    <v-touch @swiperight="swiperight" style="position:absolute; top:85px; bottom:0; width:100%;">
        <keep-alive>
            <building-list v-if="view=='buildingList'" @goto-detail="handleGotoBuildingDetail"></building-list>
            <building-detail v-else-if="view=='buildingDetail'" :buildingId="buildingId" :refresh="refreshBuildingDetail" @goto-model-detail="handleGotoModelDetail" @back="handleBack"></building-detail>
            <buildingmodel-detail v-else-if="view=='buildingmodelDetail'" :modelId="modelId" :buildingId="buildingId" :building="building" :refresh="refreshBuildingModelDetail" @back="handleModelBack"></buildingmodel-detail>
        </keep-alive>
    </v-touch>
</div>
</template>

<script>
import NavMenu from "../../components/nav_menu";
import buildingList from "@/view/model/building-list";
import buildingDetail from "@/view/model/building-detail";
import buildingmodelDetail from "@/view/model/buildingmodel-detail";

export default {
    data() {
        return {
            view: "buildingList",
            buildingId: null,
            modelId: null,
            building: {},
            refreshBuildingDetail: true,
            refreshBuildingModelDetail: true
        };
    },
    components: {
        NavMenu,
        buildingList,
        buildingDetail,
        buildingmodelDetail
    },
    created() {
        if (this.$route.query.view == 'buildingmodelDetail') {
            this.buildingId = this.$route.query.buildingId;
            this.modelId = this.$route.query.modelId;
        }
        if (this.$route.query.view) {
            this.view = this.$route.query.view;
        }
    },
    updated(){
        this.$refs.navMenu.canGoForward = this.$electron.remote.getCurrentWebContents().canGoForward();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            if (this.$route.query.view) {
                this.view = this.$route.query.view;
            } else {
                this.view = "buildingList";
            }
        }
    },
    methods: {
        handleBack() {
            let view = "buildingList";
            this.handleUpdateRouteParam(view);
        },
        handleGotoBuildingDetail(buildingId) { // 跳转到楼盘详细页面
            this.refreshBuildingDetail = (this.buildingId != buildingId);
            this.buildingId = buildingId;
            let view = "buildingDetail";
            this.handleUpdateRouteParam(view);
        },
        handleModelBack() {
            this.refreshBuildingDetail = false;
            let view = "buildingDetail";
            this.handleUpdateRouteParam(view);
        },
        handleGotoModelDetail(modelId, building) { // 跳转到户型详细页面
            this.refreshBuildingModelDetail = (this.modelId != modelId);
            this.modelId = modelId;
            this.building = building;
            let view = "buildingmodelDetail";
            this.handleUpdateRouteParam(view);
        },
        handleUpdateRouteParam(view) {
            let query = {
                ...this.$route.query,
                view: view,
                buildingId: this.buildingId,
                modelId: this.modelId
            };
            this.$router.push({
                query
            });
        },
        swiperight() {
            if (this.view == "buildingmodelDetail") {
                this.handleModelBack();
            } else if (this.view == "buildingDetail") {
                this.handleBack();
            }
        }
    }
};
</script>
