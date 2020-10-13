import { _get, _post, _delete, _put } from './index';

/**
 * 查询筛选条件
 * @param params
 */
export const getCategoryList = (params) => {
    return _get({
        url: '/modity/modity',
        data: params
    });
};

/**
 * 查询列表
 * @param params
 */
export const findList = (params) => {
    return _get({
        url: '/modity/findList',
        data: params
    });
};

/**
 * 根据ID详细信息
 * @param params
 */
export const getInfo = (params) => {
    return _get({
        url: '/modity/info',
        data: params
    });
};

/**
 * 查询产品适用空间选项
 * @param params
 */
export const querySpaceOptions = (params) => {
    return _get({
        url: '/tvModity/querySpaceOptions',
        data: params
    });
};


/**
 * 查询产品适用风格选项
 * @param params
 */
export const queryStyleOptions = (params) => {
    return _get({
        url: '/tvModity/queryStyleOptions',
        data: params
    });
};


/**
 * 查询产品分类选项
 * @param params
 */
export const queryClassifyOptions = (params) => {
    return _get({
        url: '/tvModity/queryClassifyOptions',
        data: params
    });
};

/**
 * 查询产品规格选项
 * @param params
 */
export const queryModitySizeOptions = (params) => {
    return _get({
        url: '/tvModity/queryModitySizeOptions',
        data: params
    });
};

/**
 * 查询产品色系选项
 * @param params
 */
export const queryColourOptions = (params) => {
    return _get({
        url: '/tvModity/queryColourOptions',
        data: params
    });
};

/**
 * 查询产品系列选项
 * @param params
 */
export const queryCategoryOptions = (params) => {
    return _get({
        url: '/tvModity/queryCategoryOptions',
        data: params
    });
};