<template>
    <common-case-list @item-click="handleItemClick" caseType='yjhz' >
        <template slot-scope="props">
            <div class="img_title_content">
                <span class="title">{{props.value.spaceName}}</span>
                <span class="icon">                            
                        <img v-if="props.value.ue4SceneId" src="~@/assets/local/images/vr_one.png" alt="">
                        <img v-if="props.value.sceneId" src="~@/assets/local/images/DIY_one.png" alt="">
                </span>
            </div>
        </template>
    </common-case-list>
</template>

<script>
import CommonCaseList from "../../components/common_case_list";
export default {
    components: {
        CommonCaseList
    },
    methods: {
        handleItemClick(e,item){
            this.$router.push({
                    path: "/main/case_info",
                    query: {
                        change_brick_flag: 5,
                        spaceId: item.value.spaceId
                    }
                });
        }
    }
};
</script>
