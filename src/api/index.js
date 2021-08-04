import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";
import {BASE} from '../utils/constants';

//登录
export const ReqLogin=(data)=>ajax(BASE+'/login',data,'POST');

//添加用户/更新用户
export const AddUser=(user)=>ajax(BASE+'/manage/user/'+(user._id?'update':'add'),user,'POST');

//获取一级/二级列表
export const reqList=(parentId)=>ajax(BASE+'/manage/category/list',{parentId});

//添加分类/列表项
export const reqAddCategory=(parentId,categoryName)=>ajax(BASE+'/manage/category/add',{parentId,categoryName},'POST');

//更新分类
export const reqUpdateCategory=(categoryId,categoryName)=>ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST');

//获取商品分页列表
export const reqProduct=(pageNum,pageSize)=>ajax(BASE+'/manage/product/list',{pageNum,pageSize});

//根据商品名称/商品描述获取商品分页列表
export const reqProductByNameOrDesc=(pageNum,pageSize,productNameOrDesc,searchType)=>ajax(BASE+'/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:productNameOrDesc
});

//对商品进行上下架处理
export const reqOffAndOn=(productId,status)=>ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST');

//根据分类Id获取分类名称
export const reqCategoryName=(categoryId)=>ajax(BASE+'/manage/category/info',{categoryId});

//删除图片
export const reqDeletePicture=(name)=>ajax(BASE+'/manage/img/delete',{name},'POST');

//添加/更新商品
export const reqAddOrUpdateProduct=(product)=>ajax(BASE+'/manage/product/'+(product._id?'update':'add'),product,'POST');

//获取角色列表
export const reqGetRoleList=()=>ajax(BASE+'/manage/role/list');

//添加角色
export const reqAddRole=(roleName)=>ajax(BASE+'/manage/role/add',{roleName},'POST');

//更新角色
export const reqUpdateRole=(role)=>ajax(BASE+'/manage/role/update',role,'POST');

//获取用户列表(含角色)
export const reqGetUserList=()=>ajax(BASE+'/manage/user/list');

//删除用户
export const reqDeleteUser=(userId)=>ajax(BASE+'/manage/user/delete',{userId},'POST');


//jsonp请求数据——获取天气数据
export const getWeather=(cityCode)=>{
    return new Promise((resolve,reject)=>{
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=72999d8b7494cbdcf6b1851224fe779a&city=${cityCode}`;
        jsonp(url,{},(err,data)=>{
            if(!err&&data.status==="1"){
                //请求成功
                const {province,city,temperature,weather}=data.lives[0];
                resolve({province,city,temperature,weather});
            }else{
                message.error(err);
            }
        })
    })
}