<template>
    <common-case-list @item-click="handleItemClick" caseType='vr'>
        <template slot-scope="props">
            <div class="img_title_content">
                <span class="title">{{props.value.spaceName}}</span>
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
                        full_spherical_flag: 4,
                        spaceId: item.value.spaceId
                    }
                });
        }
    }
};
</script>
