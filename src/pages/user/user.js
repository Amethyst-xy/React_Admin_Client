import React, { Component } from "react";
import { Card,Button,Table,Modal, message } from "antd";
import { reqGetUserList,AddUser, reqDeleteUser, } from "../../api";
import {dateFormat} from '../../utils/dateUtils';
import LinkButton from '../../components/link_button/link_button';
import AddForm from './add_form';

class User extends Component{
    constructor(props){
        super(props);
        this.state={
            userList:[],
            roleList:[],//角色列表
            isShow:false,
            user:null//行对象，处理修改/创建
        }
    }

    //初始化表格
    initTable=()=>{
        this.columns=[
            {
                title:'用户名',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email'
            },
            {
                title:'电话',
                dataIndex:'phone'
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:time=>dateFormat(time)
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render:(id)=>{
                    let role=null;
                    this.state.roleList.forEach(item=>{
                        if(id===item._id){
                            role=item.name;
                        }
                    });
                    return role;
                }
            },            {
                title:'操作',
                render:(user)=>{
                    return (
                        <div>
                            <LinkButton onClick={()=>{this.modifyUser(user)}}>修改</LinkButton>
                            <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                        </div>
                    );
                }
            }
        ]
    }

    //获取用户数据
    getUserList=async ()=>{
        const res=await reqGetUserList();
        if(res.status===0){
            this.setState({userList:res.data.users,roleList:res.data.roles});
        }
    }

    //处理Modal的显示与隐藏
    handleCancel=()=>{
        this.setState({isShow:false},()=>{
            this.form.resetValues();
        });
    }

    //添加用户/修改用户
    handleOk=async ()=>{
        const data=await this.form.onFinish();
        if(data){
            this.setState({isShow:false});
            this.form.resetValues();
            const {username,password,phone,email,role}=data;
            const user={
                username,
            };
            if(phone) user.phone=phone;
            if(email) user.email=email;
            if(role){//获取角色_id
                this.state.roleList.forEach(item=>{
                    if(role===item.name){
                        user.role_id=item._id;
                    }
                })
            }
            if(this.state.user){//更新用户，有_id无密码
                user._id=this.state.user._id;

            }else{//添加用户,有密码无_id
                user.password=password;
            }
            //发送请求添加/修改用户
            const res=await AddUser(user);
            if(res.status===0){
                message.success(this.state.user?'修改成功':'创建成功');
                this.getUserList();
            }else{
                message.error(this.state.user?'修改失败':'创建失败');
            }
        }
    }

    //删除用户
    deleteUser=(user)=>{
        Modal.confirm({
            content: `确定要删除${user.username}吗？`,
            okText:'确定',
            cancelText:'取消',
            onOk:async ()=>{
                const res=await reqDeleteUser(user._id);
                if(res.status===0){
                    message.success('删除成功');
                    this.getUserList();
                }else{
                    message.error('删除失败');
                }
            }
        })
    }

    //点击修改
    modifyUser=(user)=>{
        if(user.role_id){
            this.state.roleList.forEach(item=>{
                if(user.role_id===item._id){
                    user.role=item.name;
                }
            })
        }
        this.setState({isShow:true,user},()=>{
            this.form.resetValues();
        });
    }


    render(){
        const {userList,isShow,user}=this.state;

        const title=(
            <Button 
                type='primary' 
                onClick={()=>{this.setState({isShow:true,user:null},()=>this.form.resetValues())}}
            >创建用户</Button>
        );
        return (
            <div>
                <Card title={title}>
                    <Table 
                        dataSource={userList}
                        columns={this.columns}
                        rowKey="_id"
                    >

                    </Table>
                </Card>
                <Modal
                    visible={isShow}
                    title={user?'修改用户':'添加用户'}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                >
                    <AddForm ref={form=>this.form=form} user={user}/>
                </Modal>
            </div>
        );
    }

    componentDidMount(){
        this.initTable();
        this.getUserList();
    }
}

export default User;