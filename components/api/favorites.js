import { _get, _post, _delete, _put } from './index';
import qs from 'qs';
/**
 * 查询收藏列表
 * @param params 
 */
export const findLocalFavorites = (params) => {
    return _get({
        url:'/favorites/local/search',
        data: params
    });
}
/**
 * 查询收藏列表
 * @param params 
 */
export const findAllLocalFavorites = (params) => {
    return _get({
        url:'/favorites/local/list',
        data: params
    });
}
/**
 * 
 * @param {清空} params 
 */
export const cleanupFavorites = (params) => {
    alert(234);
    return _get({
        url: '/favorites/cleanup',
        data: params
    });
}

/**
 * 
 * @param {商品加入收藏} params 
 */
export const addFavorites = (params) => {
    return _post({
        url: 'favorites/local/save',
        data: qs.stringify(params, { arrayFormat: 'brackets' })
    });
}

/**
 * 
 * @param {实景图跳转到详情页需要用到spaceId} params 
 */

export const getFavoritesSpaceId = (params) => {
  
    return _get({
        url: '/sceneProgramme/getSceneSpaceImage',
        data: params
    });
}
