import { _get, _post, _delete,_put } from './index';


export const headList=(data)=>{
    let req={
        url:`salesmen`
    };
    return _get(req);
}

export const withoutPsw=(data)=>{
    let req={
        url:`login-without-pwd`,
        data
    };
    return _post(req);
}