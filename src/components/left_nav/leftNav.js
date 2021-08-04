import React, { Component, Fragment } from 'react';
import { Menu } from 'antd';
import menuList from '../../config/menuConfig';
import logo from '../../assets/images/logo.png';
import './index.less';
import { Link, withRouter } from 'react-router-dom';
import memoryUtils from '../../utils/memoryUtils';

const { SubMenu } = Menu;

class LeftNav extends Component {

    //判断当前用户对cur是否有权限
    hasNav(cur){
        //当前用户是admin
        //cur是公开的
        //cur.key在meus中
        //当前用户有cur子菜单项的权限
        if(this.user.username==='admin'||cur.isPublic||this.menus.indexOf(cur.key)!==-1){
            return true;
        }else if(cur.children){
            return !!cur.children.find(child=>this.menus.indexOf(child.key)!==-1);
        }
        return false;
    }

    //reduce()+递归动态展示menu
    showMenu2(menulist) {
        const path=this.props.location.pathname;
        return menulist.reduce((pre, cur) => {
            //判断相应用户的权限
            if(this.hasNav(cur)){
                if (!cur.children) {
                    pre.push(
                        <Menu.Item key={cur.key} icon={cur.icon}>
                            <Link to={cur.key}>{cur.title}</Link>
                        </Menu.Item>
                    )
                } else {
                    if (cur.children.find(item => path.indexOf(item.key)===0)) {
                        this.openKey = cur.key;
                    }
                    pre.push(
                        <SubMenu key={cur.key} icon={cur.icon} title="商品">
                            {this.showMenu2(cur.children)}
                        </SubMenu>
                    )
                }
            }

            return pre;
        }, [])
    }

    UNSAFE_componentWillMount() {
        //当前用户
        this.user=memoryUtils.user;
        //获取用户menus
        this.menus=memoryUtils.user.role.menus;
        this.list = this.showMenu2(menuList);
    }

    render() {
        let path=this.props.location.pathname;
        if(path.indexOf('/product')===0){
            path='/product';//当前路由是product的子路由界面
        }
        const openKey=this.openKey;
        return (
            <Fragment>
                <header className='admin_header'>
                    <img src={logo} alt='logo' />
                    <h1>硅谷后台</h1>
                </header>
                <Menu
                    defaultSelectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {this.list}
                </Menu>
            </Fragment>
        );
    }
}

export default withRouter(LeftNav);