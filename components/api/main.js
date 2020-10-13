import {
    _get,
    _post,
    _delete,
    _put
} from './index';
import qs from 'qs';

export const getQrLoginCode = (data) => {
    let req = {
        url: `qrLoginCode`,
        data: qs.stringify(data)
    };
    return _get(req);
}

export const checkLoginStatus = (data) => {
    let req = {
        url: `checkQrLoginStatus`,
        data
    };
    return _get(req);
}

export const userLogin = (data) => {
    let req = {
        url: `login`,
        data: qs.stringify(data)
    };
    return _post(req);
}

export const changeUserLogin = (data) => {
    let req = {
        url: `login-without-pwd`,
        data: qs.stringify(data)
    };
    return _post(req);
}

export const activateLicense = (data) => {
    let req = {
        url: `license/activate`,
        data
    };
    return _post(req);
}

// export const checkLicense = (data) => {
//     let req = {
//         url: `license/check`,
//         data
//     };
//     return _post(req);
// }
export const checkLicense = (data) => {
    let req = {
        url: `license/check-license`,
        data
    };
    return _post(req);
}
export const salesmen = (data) => {
    let req = {
        url: `salesmen`
    };
    return _get(req);
}

export const logScene720 = (data) => {
    let req = {
        url: `log/logScene720`,
        data
    };
    return _get(req);
}

export const logSceneDIY = (data) => {
    let req = {
        url: `log/logSceneDIY`,
        data
    };
    return _get(req);
}

export const logSceneVR = (data) => {
    let req = {
        url: `log/logSceneVR`,
        data
    };
    return _get(req);
}

export const logLicense = (data) => {
    let req = {
        url: `log/logLicense`,
        data: qs.stringify(data)
    };
    return _post(req);
}

export const logColse = () => {
    let req = {
        url: `log/logTvClosed`
    };
    return _get(req);
}

export const noticeChannel = (data) => {
    let req = {
        url: `notice/getByChannel`,
        data
    };
    return _get(req);
}

export const faceLogin = (data) => {
    let req = {
        url: `face-login`,
        data
    };
    return _post(req);
}
export const bannerData= (data) => {
    console.log('bannerData')
    let req = {
        url: `banner/list`,
        data
    };
    return _get(req);
}