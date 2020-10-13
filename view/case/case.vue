<template>
<div>
    <nav-menu></nav-menu>
    <left-content :param="spaceQueryParam" @change-param="handleChangeQueryParam"></left-content>
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
    activated() {
        if (!this.firstQuery) {
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
        }
    }
};
</script>
