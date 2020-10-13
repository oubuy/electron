<template>
<div class="filter_box">
    <div class="filter_head">
        <slot name='icon'>
            <Icon type="md-color-filter" size='24' color='#c59b5f' />
        </slot><span>{{data.title}}</span>
    </div>
    <slot name="changeButtonCity" class="changeButton"></slot>
    <ul class="lastFilter">
        <li v-for="(item,index) in data.options" :key="index" @click="handleSelect(item, index)" :class="index%3!=2?'line_not_end':''"><span :class="(data.selected==item.id ? 'attr_color' : '')">{{item.name}}</span></li>
    </ul>
</div>
</template>

<script>
import $ from "jquery";

export default {
    props: {
        data: {
            type: Object,
            default: {
                title: '过滤',
                selected: '',
                options: [{
                    id: '',
                    name: '全部'
                }]
            }
        }
    },
    data() {
        return {

        };
    },
    created() {

    },
    methods: {
        handleSelect(option) {
            this.data.selected = option.id;
            this.$emit("on-select", option);
        }
    }
};
</script>

<style lang="less" scoped>
.filter_box {
    margin-top: 0px;

    .filter_head {
        line-height: 24px;
        display: flex;
        align-items: center;

        span {
            margin-left: 6px;
            color: #555;
            // font-size: 24px;
            font-size: 20px;
            display: inline-block;
        }
    }

    .changeCityAddress {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .city_button {
            background: #c59b5f;
            color: #fff;
            padding: 2px 3px;
            font-size: 12px;
            border-radius: 3px;
            cursor: pointer;
        }
    }

    ul {
        list-style-type: none;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 20px;

        li {
            width: 68px;
            height: 36px;
            color: #c59b5f;
            // margin-right: 24px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #c59b5f;
            cursor: pointer;
            border-radius: 3px;

            .attr_color {
                background: url("~@/assets/local/images/bg_02.png") no-repeat;
                width: 69px;
                height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            span {
                font-size: 13px;
            }
        }

        .line_not_end {
            margin-right: 24px;
        }
    }
}
</style>
