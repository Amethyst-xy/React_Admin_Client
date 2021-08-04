import React, { Component } from "react";
import { Card, Table, Modal, message } from 'antd';
import LinkButton from "../../components/link_button/link_button";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";
import './index.less';
import { reqList,reqAddCategory,reqUpdateCategory } from '../../api';
import AddForm from "./add_form";
import UpdateForm from "./update_form";
import { PAGE_SIZE } from "../../utils/constants";

class Category extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: [],
            category:[],
            parentId: 0,
            title: '',
            isvisible_add:false,
            isvisible_modify:false,
            curcategory:{},
            loading:false
        }
    }

    //初始化表格
    initTable() {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: '300px',
                render: (category) => (
                    <div>
                        <LinkButton onClick={
                            ()=>{this.operateModal(2);
                                console.log(category);
                            this.modifyCategoryName(category)}}
                        >修改分类</LinkButton>
                        {
                            this.state.parentId === 0 ?
                                <LinkButton onClick={
                                    () => { this.getCategory(category) }}
                                >查看子分类</LinkButton> : null
                        }
                    </div>
                )
            },
        ];
    }

    //获取一级/二级分类列表
    getCategory = async (category) => {
        let data, parentId, title;
        this.setState({loading:true});
        if (category) {
            data = await reqList(category._id);
            parentId = category._id;
            title = category.name;
        } else {
            data = await reqList(0);
            parentId = 0;
            title = '';
            this.setState({category:data.data});
        }
        this.setState({ dataSource: data.data, parentId, title,loading:false });
    }

    //打开/关闭Modal对话框
    //1-打开添加关闭修改,2-开修改关添加，3-都关
    operateModal(value){
        if(value===1){
            this.setState({isvisible_add:true,isvisible_modify:false});
        }else if(value===2){
            this.setState({isvisible_add:false,isvisible_modify:true});
        }else if(value===3){
            this.setState({isvisible_add:false,isvisible_modify:false});
        }
    }

    //添加分类
    addCategory(category,categoryName){
        //若添加的是一级分类
        if(category==='一级列表'){
            reqAddCategory(0,categoryName);
            this.getCategory();
        }else{//若是二级分类
            this.state.category.forEach(item=>{
                if(item.name===category){
                    reqAddCategory(item._id,categoryName);
                    this.getCategory(item);
                }
            })
        }
    }

    //修改分类
    handleModify(categoryId,categoryName){
        reqUpdateCategory(categoryId,categoryName);

        //修改后刷新
        let first;
        //一级列表
        this.state.category.forEach(item=>{
            if(item._id===categoryId) first=true;
        })
        if(first) this.getCategory();
        else{
            this.state.dataSource.forEach(item=>{
                if(item._id===categoryId){
                    this.state.category.forEach(i=>{
                        if(i._id===item.parentId) this.getCategory(i);
                    })
                }
            })
        }
    }

    //修改category状态，重置子组件的默认值
    modifyCategoryName(category){
        this.setState({curcategory:category},()=>this.ref&&this.ref.resetCategoryName())
    }
    
    //处理关闭Modal with OK
    handleOk(value){
        if(value.sign===1){//添加分类
            this.addCategory(value.category,value.categoryName);
        }else{//修改分类
            let id=this.state.curcategory._id;
            let name=value.categoryName;
            this.handleModify(id,name);
        }
    }

    //触发表单验证并关闭Modal
    async handleValidate(ref){
        let data=await ref.onFinish();
        if(data){
            this.operateModal(3);
            this.handleOk(this.ref.state);
            message.success('添加成功!',1);
        }
    }


    UNSAFE_componentWillMount() {
        this.initTable();
    }
    componentDidMount() {
        this.getCategory();
    }

    render() {
        const {title,
            dataSource,
            category,
            isvisible_add,
            isvisible_modify,
            loading,
            curcategory}=this.state;

        const Title = title === '' ? '一级分类列表' : (
            <div>
                <LinkButton onClick={() => { this.getCategory() }}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{ marginRight: "10px" }} />
                {title}
            </div>
        )
        const extra = (
            <LinkButton onClick={()=>{this.operateModal(1)}}>
                <span className='add_btn'>
                    <PlusOutlined className='icon' />
                    添加分类
                </span>
            </LinkButton>
        );
        return (
            <div>
                <Card 
                title={Title} 
                extra={extra} 
                style={{ width: "100%", height: "100%"}} 
                loading={loading}
                >
                    <Table
                        rowKey={key => key.name}
                        dataSource={dataSource}
                        columns={this.columns}
                        bordered
                        pagination={{ 
                            pageSize: PAGE_SIZE, 
                            showQuickJumper: true 
                        }}
                    />
                    <Modal title={isvisible_add?"添加分类": "修改分类"}
                        visible={isvisible_add||isvisible_modify} 
                        onOk={()=>{this.handleValidate(this.ref)}} 
                        onCancel={()=>{this.operateModal(3)}}>
                        {
                            isvisible_add?<AddForm category={category} onRef={ref=>this.ref=ref}/>:
                            <UpdateForm category={curcategory.name} onRef={ref=>this.ref=ref}/>
                        }
                    </Modal>
                </Card>
            </div>
        )
    }
}

export default Category;