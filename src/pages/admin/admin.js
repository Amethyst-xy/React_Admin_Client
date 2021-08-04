import React, { Component } from "react";
import memoryUtils from '../../utils/memoryUtils';
import { Layout } from 'antd';
import LeftNav from '../../components/left_nav/leftNav';
import Bar from '../bar/bar';
import Category from "../category/category";
import Home from "../home/home";
import Line from "../line/line";
import Pie from "../pie/pie";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";
import NotFound from '../notfound/notfound';
import Header from "../../components/header/header";
import {Switch,Route,Redirect} from 'react-router-dom';

const { Footer, Sider, Content } = Layout;

class Admin extends Component {
    render() {
        const user = memoryUtils.user;
        if (!user || !user._id) {
            return <Redirect to='/login'></Redirect>
        }
        return (
            <Layout style={{ minHeight: "100%" }}>
                <Sider style={{ color: "#fff" }}>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header style={{ background: "#f0f2f5" }}>Header</Header>
                    <Content style={{ background: "#fff",margin:"20px" }}>
                        <Switch>
                            <Redirect exact from='/' to='/home'></Redirect>
                            <Route path='/home' component={Home}></Route>
                            <Route path='/charts/bar' component={Bar}></Route>
                            <Route path='/category' component={Category}></Route>
                            <Route path='/charts/line' component={Line}></Route>
                            <Route path='/charts/pie' component={Pie}></Route>
                            <Route path='/product' component={Product}></Route>
                            <Route path='/role' component={Role}></Route>
                            <Route path='/user' component={User}></Route>
                            <Route component={NotFound}></Route>
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: "center", color: "#aaa" }}>推荐使用谷歌浏览器，获得更佳页面体验</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Admin;