import "axios";
import axios from "axios";
import {message} from 'antd';

export default function ajax(url,data,type='GET'){
    return new Promise(async (resolve,reject)=>{
        let promise;
        try {
            if(type==='GET'){
                promise=await axios.get(url,{//配置对象
                    params:data//请求参数
                });
            }else{
                promise=await axios.post(url,data);
            }
            resolve(promise.data);
        } catch (error) {
            message.error(error.toString());
        }
    })
}