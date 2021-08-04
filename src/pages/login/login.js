import React,{Component} from 'react';
import './login.less';
import url from '../../assets/images/logo.png';
import { Form, Input, Button,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {ReqLogin} from '../../api';
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from '../../utils/storageUtils';
import { Redirect } from "react-router-dom";

class Login extends Component{
    render(){
        const user=memoryUtils.user;
        if(user&&user._id){
            return <Redirect to='/'></Redirect>
        }

        const onFinish=async (values)=>{
            let res=await ReqLogin(values);
            if(res.status===0){
                memoryUtils.user=res.data;
                //添加到本地缓存
                storageUtils.addUser(memoryUtils.user);

                message.success('登录成功',1);
                this.props.history.replace('/');
            }else{
                message.error(res.msg);
            }
        }
        return (
            <div className='login_container'>
                <div className='login_header'>
                    <img src={url} alt='logo'/>
                    <h1>React项目:后台管理系统</h1>
                </div>
                <div className='login_form'>
                    <h1>用户登录</h1>
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={onFinish}>
                        <Form.Item name="username"
                            rules={[
                                {
                                    required:true,
                                    message:'必须输入'
                                }
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item name="password"
                            rules={[
                                {
                                    min:4,
                                    max:12,
                                    message:'密码长度间于4~12之间'
                                }
                            ]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Login;