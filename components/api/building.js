import { _get, _post, _delete, _put } from './index';
import axios from 'axios';
import qs from 'qs';

export const findArea = (params) => {
    return _get({
        url: '/address/findArea',
        data: params
    });
};

/**
 * 查询楼盘列表
 * @param params
 */
export const findBuilding = (params) => {
    return _get({
        url: '/building/find',
        data: params
    });
};

/**
 * 根据ID获取楼盘详细信息
 * @param params
 */
export const getBuilding = (params) => {
    return _get({
        url: '/building/get',
        data: params
    });
};

/**
 * 获取楼盘标签
 * @param params
 */
export const getBuildingLabels = (params) => {
    return _get({
        url: '/building/getBuildingLabels',
        data: params
    });
};

/**
 * 分页查询户型信息
 * @param params
 */
export const findBuildingModel = (params) => {
    return _get({
        url: '/buildingmodel/find',
        data: params
    });
};

/**
 * 根据户型ID获取户型信息
 * @param params
 */
export const getBuildingModel = (params) => {
    return _get({
        url: '/buildingmodel/get',
        data: params
    });
};

/**
 * 获取户型特点
 * @param params
 */
export const getModelLabels = (params) => {
    return _get({
        url: '/buildingmodel/getModelLabels',
        data: params
    });
};

/**
 * 获取“风格”选项
 * @param params
 */
export const listStyle = (params) => {
    return _get({
        url: '/space/listStyle',
        data: params
    });
};

/**
 * 获取“空间类型”选项
 * @param params
 */
export const listSpaceType = (params) => {
    return _get({
        url: '/space/listSpaceType',
        data: params
    });
};

/**
 * 获取“案例户型”选项
 * @param params
 */
export const listSpaceModelType = (params) => {
    return _get({
        url: '/space/listSpaceModelType',
        data: params
    });
};

/**
 * 获取“案例户型”选项
 * @param params
 */
export const listSpaceModelArea = (params) => {
    return _get({
        url: '/space/listSpaceModelArea',
        data: params
    });
};


/**
 * 查询案例列表
 * @param params
 */
export const findSpace = (params) => {
    return _get({
        url: '/space/find',
        data: params
    });
};

export const findSpaceByPost = (params) => {
    return axios({
        method: 'post',
        url: '/space/find',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
};
// 实景图
export const findFigureData= (params) => {
    return _get({
        url: '/sceneProgramme/find',
        data: params
    });
};
// 实景图详情
export const findFigureInfo= (params) => {
    return _get({
        url: '/sceneProgramme/getDetail',
        data: params
    });
};
// 实景图关联产品
export const findFigureInfoProduce= (params) => {
    return _get({
        url: '/sceneProgramme/getSpaceProducts',
        data: params
    });
};
// 切换关联案例
export const figureInfoRelatedCases= (params) => {
    return _get({
        url: '/sceneProgramme/getRelatedCases',
        data: params
    });
};


/**
 * 根据ID获取案例详细信息
 * @param params
 */
export const getSpace = (params) => {
    return _get({
        url: '/space/get',
        data: params
    });
};

/**
 * 根据ID获取案例详细信息
 * @param params
 */
export const getSpaceLabels = (params) => {
    return _get({
        url: '/space/getSpaceLabels',
        data: params
    });
};


/**
 * 根据ID获取案例详细关联产品信息
 * @param params
 */
export const getSpaceProduct = (params) => {
    return _get({
        url: '/space/getSpaceProduct',
        data: params
    });
};

/**
 * 获取案例效果图列表
 * @param {*} params 
 */
export const getXgtImages = (params) => {
    return _get({
        url: '/space/getXgtImages',
        data: params
    });
};


//获取案例关联DIY场景
export const getRelateSpace = (params) => {
    return _get({
        url: '/space/getRelatedSpaces',
        data: params
    });
};
//获取案例关联
export const getNewRelateSpace = (params) => {
    return _get({
        url: '/space/findSameProgrammeSpaces',
        data: params
    });
};
// 实景图关联案例
export const getFigureRelateSpace = (params) => {
    return _get({
        url: 'sceneProgramme/getRelatedCases',
        data: params
    });
};

// 省
export const findProvince = (params) => {
    return _get({
        url: '/address/findProvince',
        data: params
    });
};
// 市
export const findCity = (params) => {
    return _get({
        url: '/address/findCity',
        data: params
    });
};

