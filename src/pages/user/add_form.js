import React,{Component} from 'react';
import {Form, Input,Select} from 'antd';
import {reqGetRoleList} from '../../api';

const {Option}=Select;

class AddForm extends Component{
    constructor(props){
        super(props);
        this.state={
            roleList:[]
        };
    }

    //获取角色列表
    getRoleList=async ()=>{
        const res=await reqGetRoleList();
        if(res.status===0){
            this.setState({roleList:res.data});
        }
    }

    //触发表单验证
    onFinish=()=>{
        return this.form.validateFields().catch(err=>console.log(err));
    }

    //重置form
    resetValues=()=>{
        this.form.resetFields();
    }

    UNSAFE_componentWillMount(){
        this.getRoleList();
        const user=this.props.user;
        this.isupdate=!!user;//标记修改
        this.user=user||{};
    }

    UNSAFE_componentWillReceiveProps(nextprops){
        const user=nextprops.user;
        this.isupdate=!!user;//标记修改
        this.user=user||{};
    }

    render(){
        const {user}=this;
        const {roleList}=this.state;
        const colLayout={
            labelCol:{span:4},
            wrapperCol:{span:15}
        }

        return (
            <Form
                {...colLayout}
                ref={form=>this.form=form}
            >
                <Form.Item
                    name='username'
                    label='用户名'
                    initialValue={user.username}
                    hasFeedback
                    rules={[
                        {required:true,message:'必须输入'}
                    ]}
                >
                    <Input placeholder='请输入用户名'/>
                </Form.Item>
                    {
                        this.isupdate?'':(
                            <Form.Item
                                name='password'
                                label='密码'
                                hasFeedback
                                rules={[
                                    {required:true,message:'必须输入'},
                                    {min:6,message:'密码不能少于6位'},
                                    {pattern:/^\w+$/,message:'密码必须由数字、字母或_组成'}
                                ]}
                            >
                                <Input placeholder='请输入密码'/>
                            </Form.Item>
                        )
                    }
                <Form.Item
                    name='phone'
                    label='手机号'
                    initialValue={user.phone}
                    hasFeedback
                    rules={[
                        {pattern:/^[1][0-9]{10}$/,message:'格式不正确'}
                    ]}
                >
                    <Input placeholder='请输入手机号'/>
                </Form.Item>
                <Form.Item
                    name='email'
                    label='邮箱'
                    initialValue={user.email}
                    hasFeedback
                    rules={[
                        {
                            pattern:/[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-z]+){1,2}/,
                            message:'格式不正确'
                        }
                    ]}
                >
                    <Input placeholder='请输入邮箱'/>
                </Form.Item>
                <Form.Item
                    name='role'
                    label='角色'
                    initialValue={user.role}
                >
                    <Select>
                        {
                            roleList.map(item=>{
                                return <Option key={item._id} value={item.name}>{item.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>
        );
    }
}

export default AddForm;