import React, { Component } from "react";
import { Card,Button,Table,Modal, message } from "antd";
import './index.less';
import {reqAddRole, reqGetRoleList,reqUpdateRole} from '../../api';
import AddForm from './add_form';
import { PAGE_SIZE } from "../../utils/constants";
import AuthForm from './auth_form';
import memoryUtils from '../../utils/memoryUtils';
import storeOptions from "../../utils/storageUtils";
import {dateFormat} from '../../utils/dateUtils';

class Role extends Component{
    constructor(props){
        super(props);
        this.state={
            isloading:true,//显示加载
            roleList:[],
            role:{},//当前选中行   
            isVisibleAdd:false,//控制添加对话框显示 
            isVisibleAuth:false//设置权限
        }
    }

    //初始化表格
    initTable=()=>{
        this.columns=[
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:time=>dateFormat(time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:auth_time=>auth_time?dateFormat(auth_time):''
            },
            {
                title:'授权人',
                dataIndex:'auth_name',
                render:auth_name=>auth_name?auth_name:''
            }
        ]
    }

    //获取roleList
    getRoleList=async ()=>{
        this.setState({isloading:true});
        const res=await reqGetRoleList();
        if(res.status===0){
            this.setState({roleList:res.data,isloading:false});
        }
    }

    //设置选择行
    onRow=(role)=>{
        return {
            onClick:()=>{
                this.setState({role});          
            }
        }
    }

    //对话框
    handleCancel=(value)=>{
        if(value==='add'){
            this.setState({isVisibleAdd:false});
            this.addform.form.resetFields();
        }else if(value==='auth'){
            this.setState({isVisibleAuth:false});
        }
    }

    //创建角色
    handleOk=async ()=>{
        const res=await this.addform.onFinish();
        if(res){
            this.setState({isVisibleAdd:false});
            //添加角色
            const role=await reqAddRole(res.name);
            if(role.status===0){
                message.success('创建成功');
                this.setState((preState)=>({
                    roleList:[...preState.roleList,role.data]
                }))
            }else{
                message.error('创建失败');
            }
        }
        this.addform.form.resetFields();
    }

    //添加角色权限
    handleRoleOk=async ()=>{
        this.setState({isVisibleAuth:false});
        const menus=this.auth.getMenus();//权限列表
        const auth_time=Date.now();
        const auth_name=memoryUtils.user.username;
        const {_id}=this.state.role;
        const roleObj={
            _id,
            auth_name,
            auth_time,
            menus
        }

        //更新角色
        const res=await reqUpdateRole(roleObj);
        if(res.status===0){
            if(roleObj._id===memoryUtils.user.role._id){
                memoryUtils.user={};
                storeOptions.removeUser();
                this.props.history.replace('/login');
                message.warning('当前用户权限已更新');
            }else{
                message.success('设置成功');
                //重新获取角色列表
                this.getRoleList();
            }
        }else{
            message.error('设置失败');
        }
    }


    UNSAFE_componentWillMount(){
        this.initTable();
    }

    render(){
        const {roleList,role,isVisibleAdd,isVisibleAuth,isloading}=this.state;

        const title=(
            <div>
                <Button 
                    type='primary' 
                    className='role_button' 
                    onClick={()=>{this.setState({isVisibleAdd:true})}}
                >创建角色</Button>
                <Button 
                    type='primary' 
                    disabled={!role._id}
                    className='role_button'
                    onClick={()=>{this.setState({isVisibleAuth:true})}}
                >设置角色权限</Button>
            </div>
        );
        return (
            <Card 
                title={title}
                style={{width:"100%",minHeight:"100%"}}
            >
                <Table 
                    dataSource={roleList} 
                    columns={this.columns} 
                    loading={isloading}
                    pagination={{
                        pageSize:PAGE_SIZE,
                        showQuickJumper:true
                    }}
                    rowKey="_id"
                    rowSelection={{
                        type:"radio",
                        selectedRowKeys:[role._id]
                    }}
                    onRow={this.onRow}
                />
                <Modal 
                    title="创建角色" 
                    visible={isVisibleAdd} 
                    onOk={this.handleOk} 
                    onCancel={()=>{this.handleCancel('add')}}
                >
                    <AddForm ref={addform=>this.addform=addform}/>
                </Modal>
                <Modal 
                    title='设置角色权限'
                    visible={isVisibleAuth} 
                    onOk={this.handleRoleOk} 
                    onCancel={()=>{this.handleCancel('auth')}}
                >
                    <AuthForm role={role} ref={auth=>this.auth=auth}/>
                </Modal>
            </Card>
        );
    }
    
    componentDidMount(){
        this.getRoleList();
    }
}

export default Role;