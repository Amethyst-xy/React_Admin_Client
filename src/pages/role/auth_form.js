import React, { Component } from "react";
import { Tree,Form,Input } from 'antd';
import menulist from '../../config/menuConfig';

class AuthForm extends Component{

    constructor(props){
        super(props);
        const {menus}=props.role;
        this.state={
            treeData:[],
            checkedKeys:menus
        }
    }

    //通过menulist构造树节点数组
    getTreeArray=(menulist)=>{
        let treeData=menulist.reduce((pre,cur)=>{
            pre.push({
                title:cur.title,
                key:cur.key,
                children:cur.children?this.getTreeArray(cur.children):null
            });
            return pre;
        },[]);

        return treeData;
    }

    //改变状态,获取treeData数组
    getTreeData=()=>{
        let treeData=this.getTreeArray(menulist);
        treeData=[{
            title:"平台权限",
            key:"all",
            children:treeData
        }];
        this.setState({treeData});
    }

    //点击选择
    onCheck = (checkedKeys) => {
        this.setState({checkedKeys});
    };

    //获取选择的keys
    getMenus=()=>{
        return this.state.checkedKeys;
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const {menus}=nextProps.role;
        this.setState({checkedKeys:menus});
    }

    UNSAFE_componentWillMount(){
        this.getTreeData();//根据menulist初始化treeData
    }

    render(){
        const {treeData,checkedKeys}=this.state;
        return (
            <div>
                <Form.Item
                    labelCol={{span:4}}
                    wrapperCol={{span:10}}
                    label="角色名称"
                >
                    <Input value={this.props.role.name} disabled/>
                </Form.Item>
                <Tree
                    checkable
                    defaultExpandAll="true"
                    treeData={treeData}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                />
            </div>
        );
    }
}

export default AuthForm;