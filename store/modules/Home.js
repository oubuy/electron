const state = {
    //员工列表
    employeeList: [],
    //登录时，返回用户信息
    loginUser: {},
    // 已下载场景列表
    downloadedScenes: [],
}
const getters = {
    loginUser: state => {
        return state.loginUser;
    },
    employeeList: state => {
        return state.employeeList;
    },
    downloadedScenes: state => {
        return state.downloadedScenes;
    }
}
const actions = {
    logout({
        commit,
        state
    }) {
        console.log('logout')
        commit('logout')
    },
    setLoginUser({
        commit,
        state
    }, loginUser) {
        console.log(loginUser, 'setLoginUser')
        commit('updateLoginUser', loginUser)
    },
    setEmployeeList({
        commit,
        state
    }, employeeList) {
        console.log(employeeList, 'setEmployeeList')
        commit('updateEmployeeList', employeeList)
    },
    setDownloadedScenes({
        commit,
        state
    }, downloadedScenes) {
        commit('updateDownloadedScenes', downloadedScenes)
    },
    setLoginUserToken({
        commit,
        state
    }, token) {
        console.log(token, 'setLoginUserToken')
        commit('updateLoginUserToken', token)
    }  

}
const mutations = {
    updateLoginUser(state, loginUser) {
        state.loginUser = loginUser
    },
    updateEmployeeList(state, employeeList) {
        state.employeeList = employeeList
    },
    updateDownloadedScenes(state, downloadedScenes) {
        state.downloadedScenes = downloadedScenes
    },
    updateLoginUserToken(state, token) {
        state.loginUser.token = token
    },
    logout(state) {
        state.employeeList = []
        state.loginUser = {}
    }

}



export default {
    // namespaced: true,
    state,
    getters,
    mutations,
    actions
}