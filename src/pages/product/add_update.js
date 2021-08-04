import React, { Component } from "react";
import { Card,Form,Input,Button,Cascader, message } from 'antd';
import { ArrowLeftOutlined } from "@ant-design/icons";
import {reqList,reqAddOrUpdateProduct} from '../../api';
import PicturesWall from './picturewall';
import RichTextEditor from './rich_text_editor';

const {TextArea}=Input;

class AddUpdate extends Component{
    constructor(props){
        super(props);
        this.state={
            options:[],
            product:{}
        }
    }

    //自定义校验商品价格
    validatePrice(_,value){
        if(value){
            if(value*1>=0){
                //校验通过
                return Promise.resolve();
            }else{
                return Promise.reject('价格不能为负');
            }
        }
        return Promise.resolve();
    }

    //表单验证成功后的回调
    async onFinish(){
        const formData=await this.formRef.validateFields().catch(err=>console.log(err));///表单数据
        const imgs=this.pw.getImgsName();//图片路径
        const detail=this.rich.getContentToHtml();//富文本编辑器content
        const _id=this.product._id;//商品id

        const {category,name,desc,price}=formData;
        const product_param={
            pCategoryId:category[0],
            categoryId:category[1],
            name,
            desc,
            price,
            imgs,
            detail   
        }
        if(this.isUpdate){
            product_param._id=_id;
        }

        //发送请求添加/更新商品
        const res=await reqAddOrUpdateProduct(product_param);
        if(res.status===0){
            message.success(this.isUpdate?'修改成功':'添加成功');
            this.props.history.goBack();
        }else{
            message.error('添加失败');
        }
    }


    //设置一级options，若是更新组件，加载二级分类
    async initOptions(data){
        const options=data.map(item=>({
            value:item._id,
            label:item.name,
            isLeaf:false
        }));

        if(this.isUpdate){//更新组件
            const {pCategoryId}=this.product;
            if(pCategoryId!=='0'){//二级分类
                let res=await this.getCategory(pCategoryId);
                //构建二级options
                const childOptions=res.map(i=>({
                    value:i._id,
                    label:i.name,
                    isLeaf:true
                }));

                //找到该二级分类对应的一级分类列表
                const targetOption=options.find(option=>option.value===pCategoryId);
                //关联起来
                targetOption.children=childOptions;
            }
        }
        //更新状态
        this.setState({options});
    }

    //根据分类id获取一级分类列表
    async getCategory(parentId){
        let res=await reqList(parentId);
        if(res.status===0){
            let data=res.data;
            //一级列表
            if(parentId===0){
                this.initOptions(data);
            }else{
                return data;//async函数返回一个成功的promise，值为二级列表
            }
        }
    }

    //加载二级级联列表
    async loadSubCategory(selectOptions){
        //获取当前选中option
        var targetOption=selectOptions[0];
        let parentId=targetOption.value;

        targetOption.loading=true;
        //获取二级分类列表
        let data=await this.getCategory(parentId);
        targetOption.loading=false;

        if(data&&data.length>0){//有二级分类列表
            //构建二级options
            let childOptions=data.map(item=>({
                value:item._id,
                label:item.name,
                isLeaf:true
            }))
            //与一级options关联
            targetOption.children=childOptions;
        }else{
            //没有二级options，将一级分类置为叶子结点
            targetOption.isLeaf=true;
        }
        //更新状态
        this.setState({
            options:[...this.state.options]
        });
    }

    UNSAFE_componentWillMount(){
        let product=this.props.location.state;
        //标识更新组件/添加组件
        this.isUpdate=!!product;
        //保存product
        this.product=product||{};
    } 

    render(){
        const {options}=this.state;
        const {isUpdate,product}=this;
        const {pCategoryId,categoryId,imgs,detail}=product;

        //数组保存的是分类列表的Id,因为级联列表的name属性值为_id
        //此处不能直接使用分类名称，将影响表单提交成功后values的值
        const categoryIds=[];

        //若是更新组件，将分类id添加到initialValues数组中
        if(isUpdate){
            if(pCategoryId==='0'){
                categoryIds.push(categoryId);
            }else{
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
            }
        }

        const title=(
            <span>
                <ArrowLeftOutlined 
                    style={{color:"#1DA57A",marginRight:10}}
                    onClick={()=>{this.props.history.goBack()}}
                />
                <span>{isUpdate?'修改商品':'添加商品'}</span>
            </span>
        );
            
        const formItemLayout={
            labelCol:{span:2},
            wrapperCol:{span:8}
        }
        
        return (
            <Card 
            title={title} 
            style={{ width: "100%"}}>
                <Form 
                    {...formItemLayout} 
                    ref={formRef=>this.formRef=formRef}
                    onFinish={()=>{this.onFinish()}}
                >
                    <Form.Item 
                        label="商品名称" 
                        name="name"
                        initialValue={product.name}
                        hasFeedback
                        rules={[
                            {required:true,message:'必须输入'}
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item 
                        label="商品描述" 
                        name="desc"
                        initialValue={product.desc}
                        rules={[
                            {required:true,message:'必须输入'}
                        ]}
                    >
                        <TextArea
                            autoSize={{minRows:2,maxRows:6}}
                        ></TextArea>
                    </Form.Item>
                    <Form.Item 
                        label="商品价格" 
                        name="price"
                        initialValue={product.price}
                        rules={[
                            {required:true,message:"必须输入"},
                            {
                                validator: this.validatePrice
                            },
                        ]}
                    >
                        <Input type='number' addonAfter="元"/>
                    </Form.Item>
                    <Form.Item 
                        label="商品分类" 
                        name="category"
                        hasFeedback
                        initialValue={categoryIds}
                        rules={[
                            {required:true,message:'必须指定商品分类'}
                        ]}
                    >
                        <Cascader 
                            options={options} 
                            placeholder="Please select" 
                            loadData={(selectOptions)=>{this.loadSubCategory(selectOptions)}}
                        />
                    </Form.Item>
                    <Form.Item label="商品图片" >
                        <PicturesWall ref={pw=>this.pw=pw} imgs={imgs}/>
                    </Form.Item>
                    <Form.Item label="商品详情" labelCol={{span:2}} wrapperCol={{span:22}}>
                        <RichTextEditor ref={rich=>this.rich=rich} detail={detail}/>
                    </Form.Item>
                    <Form.Item>
                        <Button 
                            style={{background:"#1DA57A",color:"#fff"}}
                            htmlType='submit'
                        >提交</Button>
                    </Form.Item>

                </Form>
            </Card>
        );
    }

    componentDidMount(){
        this.getCategory(0);
    }
}

export default AddUpdate;