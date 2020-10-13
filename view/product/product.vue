<template>
<div>
    <nav-menu></nav-menu>
    <osntv-layout>
        <osntv-sider>
            <search-input slot="top" placeholder="请输入产品名称/型号" @button-click="search" v-model="keyword" style="height:60px;padding-bottom:24px;"></search-input>

            <div style="margin-bottom:15px;">
                <Button type="primary" @click="resetQueryParam" long>重置筛选项</Button>
            </div>

            <!-- 瓷砖分类 -->
            <query-option :data="classifyOptions" @on-select="handleClassifySelect">
                <img slot="icon" src="~@/assets/local/images/left_space.png" alt>
            </query-option>

            <!-- 适用空间 -->
            <query-option :data="spaceOptions" @on-select="handleSpaceSelect">
                <img slot="icon" src="~@/assets/local/images/left_space.png" alt>
            </query-option>

            <!-- 适用风格 -->
            <query-option :data="styleOptions" @on-select="handleStyleSelect">
                <img slot="icon" src="~@/assets/local/images/left_space.png" alt>
            </query-option>

            <!-- 产品规格 -->
            <query-option :data="moditySizeOptions" @on-select="handleModitySizeSelect">
                <img slot="icon" src="~@/assets/local/images/left_space.png" alt>
            </query-option>

            <!-- 产品色系 -->
            <div class="left_product">
                <div class="common_box">
                    <div class="head_common">
                        <img src="~@/assets/local/images/left_color.png" alt>
                        <span>{{colourOptions.title}}</span>
                    </div>
                    <ul>
                        <li :class="index%3!=2?'line_not_end':''" v-for="(item,index) in colourOptions.options" :key="index" :style="{'background-color':item.colourCode}" @click="handleColourSelect(item)">
                            <span>{{item.name}}</span>
                            <img v-if="item.id==colourOptions.selected" class="attr_url" src="~@/assets/local/images/check.png" alt>
                        </li>
                    </ul>
                </div>
            </div>
        </osntv-sider>
        <Layout style="background: #f9f9f9">
            <Content style="padding-left:20px;background: #fff;">
                <div class="contnet_head" style="padding-top: 20px; padding-left:20px">
                    <div class="contnet_head_card" ref="contnet_head_card">
                        <ul>
                            <li :class="item.id==categoryOptions.selected ? 'attr_color' : '' " v-for="(item,index) in categoryOptions.options" :key="index" @click="handleCategorySelect(item)" :style="card_item_width">
                                <span>{{item.name}}</span>
                                <img v-if="item.id==categoryOptions.selected" class="attr_url" src="~@/assets/local/images/check.png" alt>
                            </li>
                            <span class="show_new" v-show="show_new">暂没有信息！！</span>
                        </ul>
                    </div>
                    <img v-if="!show_height" class="contnet_head_img" src="~@/assets/local/images/up.png" alt @click="handleOpen">
                    <img v-else class="contnet_head_downimg" src="~@/assets/local/images/down.png" alt @click="handleOpen">
                </div>
                <scroll-content ref="scrollVue" style="height:100px"></scroll-content>
            </Content>
        </Layout>
    </osntv-layout>
</div>
</template>

<script>
import {
    querySpaceOptions,
    queryStyleOptions,
    queryClassifyOptions,
    queryModitySizeOptions,
    queryColourOptions,
    queryCategoryOptions
} from "@/components/api/modity.js";
import NavMenu from "../../components/nav_menu";
import OsntvScorllContent from "../../components/osntv_scorll_content";
import OsntvLayout from "../../components/osntv_layout";
import OsntvSider from "../../components/osntv_sider";
import SearchInput from "../../components/search_input";
import FilterBox from "../../components/filter_box";
import queryOption from "../../components/query_option";

import BScroll from "better-scroll";
import scrollContent from "./product_scroll1";
// import scrollContent from "./product_scroll";
import $ from "jquery";
import Vue from "vue";

export default {
    data() {
        return {
            classifyOptions: {
                title: '瓷砖',
                selected: '',
                options: [{
                    id: '',
                    name: '全部'
                }]
            },
            categoryOptions: {
                selected: '',
                options: []
            },
            spaceOptions: {
                title: '空间',
                selected: '',
                options: [{
                    id: '',
                    name: '全部'
                }]
            },
            styleOptions: {
                title: '风格分类',
                selected: '',
                options: [{
                    id: '',
                    name: '全部'
                }]
            },
            moditySizeOptions: {
                title: '产品规格',
                selected: '',
                options: [{
                    id: '',
                    name: '全部'
                }]
            },
            colourOptions: {
                title: '产品色系',
                selected: '',
                options: [{
                    id: '',
                    name: '全部',
                    colourCode: ''
                }]
            },

            card_height: 50,
            card_item_width: "width:150px",
            movie_index: 0,
            movieList: [],
            showTipFlag: false,
            headerToken: {
                Authorization: ""
            }, //token
            keyword: "",
            lastTimeStamp: 0,
            get_height: 0,
            show_height: true,
            maxHeight: "", // 页面最大高度
            show_new: false,
            queryParam: {
                classifyId: ''
            }
        };
    },
    components: {
        NavMenu,
        scrollContent,
        OsntvLayout,
        OsntvScorllContent,
        OsntvSider,
        SearchInput,
        FilterBox,
        queryOption
    },
    created() {
        this.headerToken.Authorization = "Bearer " + localStorage.getItem("token");
        if (this.headerToken.Authorization) {
            this.queryClassifyOptions();
            this.querySpaceOptions();
            this.queryStyleOptions();
            this.queryModitySizeOptions();
            this.queryColourOptions();
        }
        this.resizeEle($(".left_product"), 120); //默认自适应，距屏幕底部80px
        this.UpdateCardItemWidth();
    },
    methods: {
        resetQueryParam() {
            this.keyword = '';
            this.$refs.scrollVue.formData.pageNum = 1;
            this.$refs.scrollVue.formData.modityName = '';
            this.$refs.scrollVue.formData.categoryId = '';
            this.$refs.scrollVue.formData.categoryName = '';
            this.$refs.scrollVue.formData.applicableSpaceId = '';
            this.$refs.scrollVue.formData.applicableStyleId = '';
            this.$refs.scrollVue.formData.specificationName = '';
            this.$refs.scrollVue.formData.colorName = '';
            this.$refs.scrollVue.getListInfo();
            this.$refs.scrollVue.scroll.scrollTo(0, 0);

            this.classifyOptions.selected = '';
            this.spaceOptions.selected = '';
            this.styleOptions.selected = '';
            this.moditySizeOptions.selected = '';
            this.colourOptions.selected = '';
            this.categoryOptions.selected = '';
            this.queryClassifyOptions();
            this.queryCategoryOptions();
            this.querySpaceOptions();
            this.queryStyleOptions();
            this.queryModitySizeOptions();
            this.queryColourOptions();
        },
        queryClassifyOptions() {
            let queryParam = {
                applicableSpaceId: this.spaceOptions.selected,
                applicableStyleId: this.styleOptions.selected,
                moditySize: this.moditySizeOptions.selected,
                colourName: this.colourOptions.selected
            };
            queryClassifyOptions(queryParam).then(resp => {
                if (resp.data.code == 200) {
                    this.classifyOptions.options = [];
                    this.classifyOptions.options.push({
                        id: "",
                        name: "全部"
                    });
                    let exist = false;
                    resp.data.data.forEach(item => {
                        this.classifyOptions.options.push({
                            id: item.id,
                            name: item.cateName
                        });
                        if (item.id == this.classifyOptions.selected) {
                            exist = true;
                        }
                    });
                    if (!exist) {
                        this.classifyOptions.selected = '';
                        this.$refs.scrollVue.formData.categoryName = '';
                    }
                }
            });
        },
        queryCategoryOptions() {
            let queryParam = {
                classifyId: this.classifyOptions.selected,
                applicableSpaceId: this.spaceOptions.selected,
                applicableStyleId: this.styleOptions.selected,
                moditySize: this.moditySizeOptions.selected,
                colourName: this.colourOptions.selected
            };
            queryCategoryOptions(queryParam).then(resp => {
                if (resp.data.code == 200) {
                    this.categoryOptions.options = [];
                    let exist = false;
                    resp.data.data.forEach(item => {
                        this.categoryOptions.options.push({
                            id: item.id,
                            name: item.cateName
                        });
                        if (item.id == this.categoryOptions.selected) {
                            exist = true;
                        }
                    });
                    if (!exist) {
                        this.categoryOptions.selected = '';
                        this.$refs.scrollVue.formData.categoryId = '';
                    }
                    if (this.categoryOptions.options.length > 0) {
                        $(".contnet_head_card")
                            .height("50px")
                            .animate({
                                height: Math.ceil(this.categoryOptions.options.length / 9) * this.card_height + "px"
                            }, 500);
                        this.show_height = false;
                        this.UpdateWrapperHeight(true);
                        this.show_new = false;
                    } else {
                        $(".contnet_head_card")
                            .animate({
                                height: "0px"
                            }, 500);
                        this.show_height = true;
                        this.UpdateWrapperHeight(false);
                    }
                }
            });
        },
        querySpaceOptions() {
            let queryParam = {
                classifyId: this.classifyOptions.selected,
                categoryId: this.categoryOptions.selected,
                applicableStyleId: this.styleOptions.selected,
                moditySize: this.moditySizeOptions.selected,
                colourName: this.colourOptions.selected
            };
            querySpaceOptions(queryParam).then(resp => {
                if (resp.data.code == 200) {
                    this.spaceOptions.options = [];
                    this.spaceOptions.options.push({
                        id: "",
                        name: "全部"
                    });
                    let exist = false;
                    resp.data.data.forEach(item => {
                        this.spaceOptions.options.push({
                            id: item.id,
                            name: item.detailName
                        });
                        if (item.id == this.spaceOptions.selected) {
                            exist = true;
                        }
                    });
                    if (!exist) {
                        this.spaceOptions.selected = '';
                        this.$refs.scrollVue.formData.applicableSpaceId = '';
                    }
                }
            });
        },
        queryStyleOptions() {
            let queryParam = {
                classifyId: this.classifyOptions.selected,
                categoryId: this.categoryOptions.selected,
                applicableSpaceId: this.spaceOptions.selected,
                moditySize: this.moditySizeOptions.selected,
                colourName: this.colourOptions.selected
            };
            queryStyleOptions(queryParam).then(resp => {
                if (resp.data.code == 200) {
                    this.styleOptions.options = [];
                    this.styleOptions.options.push({
                        id: "",
                        name: "全部"
                    });
                    let exist = false;
                    resp.data.data.forEach(item => {
                        this.styleOptions.options.push({
                            id: item.id,
                            name: item.detailName
                        });
                        if (item.id == this.styleOptions.selected) {
                            exist = true;
                        }
                    });
                    if (!exist) {
                        this.styleOptions.selected = '';
                        this.$refs.scrollVue.formData.applicableStyleId = '';
                    }
                }
            });
        },
        queryModitySizeOptions() {
            let queryParam = {
                classifyId: this.classifyOptions.selected,
                categoryId: this.categoryOptions.selected,
                applicableSpaceId: this.spaceOptions.selected,
                applicableStyleId: this.styleOptions.selected,
                colourName: this.colourOptions.selected
            };
            queryModitySizeOptions(queryParam).then(resp => {
                if (resp.data.code == 200) {
                    this.moditySizeOptions.options = [];
                    this.moditySizeOptions.options.push({
                        id: "",
                        name: "全部"
                    });
                    let exist = false;
                    resp.data.data.forEach(item => {
                        this.moditySizeOptions.options.push({
                            id: item,
                            name: item
                        });
                        if (item == this.moditySizeOptions.selected) {
                            exist = true;
                        }
                    });
                    if (!exist && this.moditySizeOptions.selected) {
                        this.moditySizeOptions.options.push({
                            id: this.moditySizeOptions.selected,
                            name: this.moditySizeOptions.selected
                        });
                    }
                }
            });
        },
        queryColourOptions() {
            let queryParam = {
                classifyId: this.classifyOptions.selected,
                categoryId: this.categoryOptions.selected,
                applicableSpaceId: this.spaceOptions.selected,
                applicableStyleId: this.styleOptions.selected,
                moditySize: this.moditySizeOptions.selected
            };
            queryColourOptions(queryParam).then(resp => {
                if (resp.data.code == 200) {
                    this.colourOptions.options = [];
                    this.colourOptions.options.push({
                        id: '',
                        name: '全部',
                        colourCode: ''
                    });
                    let exist = false;
                    resp.data.data.forEach(item => {
                        let obj = {};
                        obj.id = item.detailName;
                        obj.name = item.remark.indexOf("#") == -1 ? item.detailName : '';
                        obj.colourCode = item.remark.indexOf("#") == -1 ? '' : item.remark;
                        this.colourOptions.options.push(obj);
                        if (item.detailName == this.colourOptions.selected) {
                            exist = true;
                        }
                    });
                    if (!exist) {
                        this.colourOptions.selected = '';
                        this.$refs.scrollVue.formData.colorName = '';
                    }
                }
            });
        },
        handleClassifySelect(option) {
            this.$refs.scrollVue.formData.pageNum = 1;
            this.$refs.scrollVue.formData.categoryId = "";
            this.$refs.scrollVue.formData.categoryName = option.name == '全部' ? '' : option.name;
            this.$refs.scrollVue.getListInfo();
            this.$refs.scrollVue.scroll.scrollTo(0, 0);

            this.categoryOptions.selected = '';
            this.querySpaceOptions();
            this.queryStyleOptions();
            this.queryModitySizeOptions();
            this.queryColourOptions();
            this.queryCategoryOptions();
        },
        handleCategorySelect(option) {
            this.categoryOptions.selected = option.id;
            this.$refs.scrollVue.formData.pageNum = 1;
            this.$refs.scrollVue.formData.categoryId = option.id;
            this.$refs.scrollVue.getListInfo();
            this.$refs.scrollVue.scroll.scrollTo(0, 0);

            this.querySpaceOptions();
            this.queryStyleOptions();
            this.queryModitySizeOptions();
            this.queryColourOptions();
        },
        handleSpaceSelect(option) {
            this.$refs.scrollVue.formData.pageNum = 1;
            this.$refs.scrollVue.formData.applicableSpaceId = option.id;
            this.$refs.scrollVue.getListInfo();
            this.$refs.scrollVue.scroll.scrollTo(0, 0);

            this.queryClassifyOptions();
            this.queryStyleOptions();
            this.queryModitySizeOptions();
            this.queryColourOptions();
            this.queryCategoryOptions();
        },
        handleStyleSelect(option) {
            this.$refs.scrollVue.formData.pageNum = 1;
            this.$refs.scrollVue.formData.applicableStyleId = option.id;
            this.$refs.scrollVue.getListInfo();
            this.$refs.scrollVue.scroll.scrollTo(0, 0);

            this.queryClassifyOptions();
            this.querySpaceOptions();
            this.queryModitySizeOptions();
            this.queryColourOptions();
            this.queryCategoryOptions();
        },
        handleModitySizeSelect(option) {
            this.$refs.scrollVue.formData.pageNum = 1;
            this.$refs.scrollVue.formData.specificationName = option.id;
            this.$refs.scrollVue.getListInfo();
            this.$refs.scrollVue.scroll.scrollTo(0, 0);

            this.queryClassifyOptions();
            this.querySpaceOptions();
            this.queryStyleOptions();
            this.queryColourOptions();
            this.queryCategoryOptions();
        },
        handleColourSelect(option) {
            this.colourOptions.selected = option.id;
            this.$refs.scrollVue.formData.pageNum = 1;
            this.$refs.scrollVue.formData.colorName = option.id;
            this.$refs.scrollVue.getListInfo();
            this.$refs.scrollVue.scroll.scrollTo(0, 0);

            this.queryClassifyOptions();
            this.querySpaceOptions();
            this.queryStyleOptions();
            this.queryModitySizeOptions();
            this.queryCategoryOptions();
        },

        openKeyboard() {
            this.$electron.ipcRenderer.send("open-sys-keyboard");
            this.$refs.keyword.focus();
        },
        //内容自适应窗口大小
        resizeEle(ele, isResetH) {
            var windowHeight = window.screen.height;
            this.viewHeight = windowHeight;
            this.maxHeight = windowHeight - isResetH;
        },
        onkeyup(event) {
            if (event.keyCode != 13) {
                //除回车键外
                //标记当前事件函数的时间戳
                this.lastTimeStamp = event.timeStamp;
                setTimeout(() => {
                    //1s后比较二者是否还相同（因为只要还有事件触发，lastTimeStamp就会被改写，不再是当前事件函数的时间戳）
                    if (this.lastTimeStamp == event.timeStamp) {
                        this.$refs.scrollVue.formData.pageNum = 1;
                        this.$refs.scrollVue.formData.modityName = this.keyword;
                        this.$refs.scrollVue.getListInfo();
                    }
                }, 1000);
            }
        },
        search(d) {
            this.keyword = d;
            this.$refs.scrollVue.formData.pageNum = 1;
            this.$refs.scrollVue.formData.modityName = this.keyword;
            this.$refs.scrollVue.getListInfo();
        },
        handleOpen() {
            if (this.show_height == false) {
                let el = $(".contnet_head_card");
                let curHeight = el.height();
                el.height(curHeight).animate({
                    height: "0"
                }, 500);
                this.show_height = true;
                this.UpdateWrapperHeight(false);
            } else {
                let el = $(".contnet_head_card");
                let curHeight = el.height();
                el.height(curHeight).animate({
                    height: Math.ceil(this.categoryOptions.options.length / 9) * this.card_height + "px"
                }, 500);
                this.show_height = false;
                if (this.categoryOptions.options.length > 0) {
                    this.UpdateWrapperHeight(true);
                    this.show_new = false;
                } else {
                    this.UpdateWrapperHeight(false);
                    this.show_new = true;
                }
            }
        },
        UpdateWrapperHeight(isOpen) {
            let titleHeight = 35,
                navHeight = 50,
                siderPaddingHeight = 24,
                cardCloseHeight = 50,
                cardOpenHeight = Math.ceil(this.movieList.length / 9) * this.card_height + 30;
            var screenHeight = document.documentElement.clientHeight;
            if (isOpen) {
                this.$refs.scrollVue.wrapperHeight = screenHeight - titleHeight - navHeight - siderPaddingHeight - cardOpenHeight;
            } else {
                this.$refs.scrollVue.wrapperHeight = screenHeight - titleHeight - navHeight - siderPaddingHeight - cardCloseHeight;
            }
        },
        UpdateCardItemWidth() {
            let leftWidth = 300,
                marginSize = 20 + 200 + 18 + 23;
            var screenWidth = document.documentElement.clientWidth;
            var item_width = (screenWidth - leftWidth - marginSize) / 9;
            this.card_item_width = " width:" + item_width + "px";
        }
    }
};
</script>

<style lang="less" scoped>
.left_product {

    // box-shadow: 2px 0 3px -1px #d1d8de;
    .common_box {
        margin-top: 10px;

        .head_common {
            display: flex;
            align-items: center;

            span {
                margin-left: 6px;
                color: #555;
                font-size: 24px;
                display: inline-block;
            }
        }

        ul {
            list-style-type: none;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            margin-top: 15px;

            .color_box {
                width: 68px;
            }

            li {
                // width: 69px;
                width: 68px;
                position: relative; // padding: 0 6px;
                height: 36px;
                color: #c59b5f; // margin-right: 24px;
                margin-bottom: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #c59b5f;
                cursor: pointer;
                border-radius: 3px;

                .attr_color {
                    height: 36px;
                    display: flex;
                    padding: 0 6px;
                    background-color: #fff0e7;
                    width: 100%;
                    align-items: center;
                    justify-content: center;
                }

                .attr_url {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }

                span {
                    font-size: 13px; // padding: 0 6px;
                }
            }

            .line_not_end {
                margin-right: 24px;
            }
        }
    }
}

.contnet_head {
    position: relative;
    margin-top: 20px;
    box-shadow: 0 0 10px rgba(190, 190, 190, 0.8);
    margin-bottom: 20px;
    margin-right: 18px;
    padding: 5px;

    .contnet_head_card {
        height: 0px;
        overflow: hidden;

        .attr_color {
            display: flex;
            padding: 0 6px;
            background-color: #fff0e7;
            align-items: center;
            justify-content: center;
        }
    }

    ul {
        list-style-type: none;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        li {
            width: 150px;
            padding: 0 6px;
            height: 30px;
            color: #c59b5f;
            margin-right: 22px;
            margin-bottom: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #c59b5f;
            cursor: pointer;
            border-radius: 3px;
            position: relative;

            .attr_url {
                position: absolute;
                right: 0;
                bottom: 0;
            }

            span {
                font-size: 14px;
            }
        }
    }

    .contnet_head_img {
        position: absolute;
        left: 48.5%;
        bottom: 0;
        cursor: pointer;
    }

    .contnet_head_downimg {
        position: absolute;
        left: 48.5%;
        bottom: -24px;
        cursor: pointer;
        z-index: 300;
    }
}

.show_new {
    text-align: center;
    display: inline-block;
    width: 100%;
    font-size: 18px;
}
</style>
