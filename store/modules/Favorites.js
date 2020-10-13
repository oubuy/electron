import axios from 'axios'
import qs from 'qs';

const state = {
    spaceList: [],
    productList: [],
    figureList:[],
  

    // spaceList: [{
    //     entityUrl:'http://center.oceano.com.cn/build-web/20190227/20190227162107519_677.jpg',
    //     entityId:'S0013165',
    //     entityName:'新中式客厅'
    // }],
    // productList: [{
    //     entityUrl:'http://oceano-center.img-cn-hangzhou.aliyuncs.com/modity-web/pro/modity/c8338c9b61124df9badbf7f0fe2d6223/1550888387806.jpg',
    //     entityId:'c8338c9b61124df9badbf7f0fe2d6223',
    //     entityName:'现代风格'
    // }],
    // total: 2
    // ,
    // newsNum: 2
}
const getters = {
    spaceFavoritesList: state => {
        return state.spaceList;
    },
    productFavoritesList: state => {
        return state.productList;
    },
    figureFavoritesList: state => {
        return state.figureList;
    },
    totalFavorites: state => {
        return state.spaceList.length + state.productList.length+state.figureList.length;
    },
  
    // ,
    // newsFavoritesNum: state => {
    //     return state.newsNum;
    // }
}

const mutations = {
    addSpace(state, space) {
        state.spaceList.push({
            entityUrl: space.entityUrl,
            entityId: space.entityId,
            entityName: space.entityName
        })
        // state.total++
        // state.newsNum++
    },
    delSpace(state, spaceId) {
        for (var i = 0; i < state.spaceList.length; i++) {
            if (state.spaceList[i].entityId == spaceId) {
                state.spaceList.splice(i, 1);
                break;
            }
        }
        // state.total--       
    },
    addProduct(state, product) {
        state.productList.push({
            entityUrl: product.entityUrl,
            entityId: product.entityId,
            entityName: product.entityName
        })
        // state.total++
        // state.newsNum++
    },
    delProduct(state, productId) {
        for (var i = 0; i < state.productList.length; i++) {
            if (state.productList[i].entityId == productId) {
                state.productList.splice(i, 1);
                break;
            }
        }
        // state.total--        
    },
    addFigure(state, figure) {
       
        state.figureList.push({
            entityUrl: figure.entityUrl,
            entityId: figure.entityId,
            entityName: figure.entityName,
             imageId:figure.imageId,
            spaceId:figure.spaceId
        })
        // state.total++
        // state.newsNum++
    },
    delFigure(state, figureId) {
       
        for (var i = 0; i < state.figureList.length; i++) {
            if (state.figureList[i].entityId == figureId) {
                state.figureList.splice(i, 1);
                break;
            }
        }
        // state.total--        
    },

    // setNewsNum(state,newsNum){
    //     state.newsNum = newsNum
    // },
    init(state) {
        state.spaceList = []
        state.productList = []
        state.figureList = []
        state.total = 0
    },
  
}

const actions = {
    initSpace({ commit, state }, space) {
        commit('addSpace', space)
    },
    addSpace({ commit, state }, space) {
      
        for (var i = 0; i < state.spaceList.length; i++) {
            if (state.spaceList[i].entityId == space.entityId) {
                console.log('重复添加:', space.entityId)
                return
            }
        }
        commit('addSpace', space)

        var param = {
            mac: space.mac,
            entityType: "space",
            entityUrl: space.entityUrl,
            entityId: space.entityId,
            entityName: space.entityName
        }
        addFavoritesRemote(param)
    },
    addSpaceLocal({ commit, state }, space) {
      
        for (var i = 0; i < state.spaceList.length; i++) {
            if (state.spaceList[i].entityId == space.entityId) {
                console.log('重复添加:', space.entityId)
                return
            }
        }
        commit('addSpace', space)
    },
    removeSpace({ commit, state }, space) {
       
        commit('delSpace', space.entityId)        
        removeRemote({mac:space.mac,entityId:space.entityId})
    },
    initProduct({ commit, state }, product) {
        commit('addProduct', product)
    },
    addProduct({ commit, state }, product) {
        console.log('addProduct:', 999999)
        for (var i = 0; i < state.productList.length; i++) {
            if (state.productList[i].entityId == product.entityId) {
                console.log('重复添加:', product.entityId)
                return
            }
        }

        commit('addProduct', product)
        var param = {
            mac: product.mac,
            entityType: "modity",
            entityUrl: product.entityUrl,
            entityId: product.entityId,
            entityName: product.entityName
        }
        addFavoritesRemote(param)
    },
    addProductLocal({ commit, state }, product) {
       
        for (var i = 0; i < state.productList.length; i++) {
            if (state.productList[i].entityId == product.entityId) {
                console.log('重复添加:', product.entityId)
                return
            }
        }

        commit('addProduct', product)
    },
    removeProduct({ commit, state }, product) {
       
        commit('delProduct', product.entityId)
        removeRemote({mac:product.mac,entityId:product.entityId})
    },
    initFigure({ commit, state }, figure) {
     
        commit('addFigure', figure)
    },
    addFigure({ commit, state }, figure) {
        console.log(figure,'figure收藏')
        console.log('addFigure:', figure)
        for (var i = 0; i < state.figureList.length; i++) {
            if (state.figureList[i].entityId == figure.entityId) {
                console.log('重复添加:', figure.entityId)
                return
            }
        }

        commit('addFigure', figure)
        var param = {
            mac: figure.mac,
            entityType: "space_sjt",
            entityUrl: figure.entityUrl,
            entityId: figure.entityId,
            entityName: figure.entityName,
           
        }
        addFavoritesRemote(param)
    },
    removeFigure({ commit, state }, figure) {
        
         commit('delFigure', figure.entityId)
         removeRemote({mac:figure.mac,entityId:figure.entityId})
     },

    // cleanNewsNum({commit,state}) {
    //     console.log('cleanNewsNum')
    //     commit('setNewsNum',0)
    // },
    clean({ commit },param) {
        commit('init')
        cleanRemote(param)
    },
    cleanLocal({ commit }) {
        commit('init')
    },
 
}

function addFavoritesRemote(param) {
   
    axios({
        method: 'post',
        url: '/favorites/local/save',
        data: qs.stringify(param, { arrayFormat: 'brackets' })
    }).then(resp => {
        if (resp.data.code == 200) {
            console.log('收藏成功');
        }
    }).catch(err => {
        console.log('收藏时出现异常:', err);
    })
}

function cleanRemote(param) {
    axios({
        method: 'post',
        url: '/favorites/cleanup',
        data: qs.stringify(param, { arrayFormat: 'brackets' })
    }).then(resp => {
        if (resp.data.code == 200) {
            console.log('清空收藏夹成功');
        }
    }).catch(err => {
        console.log('清空收藏夹时出现异常:', err);
    })
}

function removeRemote(param){
    axios({
        method: 'post',
        url: '/favorites/remove',
        data: qs.stringify(param, { arrayFormat: 'brackets' })
    }).then(resp => {
        if (resp.data.code == 200) {
            console.log('移除单条收藏内容成功');
        }
    }).catch(err => {
        console.log('移除单条收藏内容时出现异常:', err);
    })

}



export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}