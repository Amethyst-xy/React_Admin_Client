import React, { Component } from "react";
import {Card,List} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {reqCategoryName} from '../../api';
import { BASE_URL } from "../../utils/constants";

class ProductDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            cName1:'',//一级列表名称
            cName2:''//二级列表名称
        }
    }

    render(){
        // 读取携带过来的路由参数
        const {name,desc,price,detail,imgs}=this.props.location.state;
        const {cName1,cName2}=this.state;
        const title=(
            <span>
                <ArrowLeftOutlined 
                    style={{color:"#1DA57A",marginRight:10}}
                    onClick={()=>{this.props.history.goBack()}}
                />
                <span>商品详情</span>
            </span>
        );
        return (
            <Card title={title}>
                <List>
                    <List.Item>
                        <span className='list_item'>
                            <span className='item_title'>商品名称：</span>
                            <span>{name}</span>
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className='list_item'>
                            <span className='item_title'>商品描述：</span>
                            <span>{desc}</span>
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className='list_item'>
                            <span className='item_title'>商品价格：</span>
                            <span>{price}元</span>
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className='list_item'>
                            <span className='item_title'>所属分类：</span>
                            <span>{cName1}{cName2?"-->"+cName2:''}</span>
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className='list_item'>
                            <span className='item_title'>商品图片：</span>
                            {
                                imgs.map((item,index)=>{
                                    return <img key={index} src={BASE_URL+item} alt='pic' className='detail_img'/>
                                })
                            }
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className='list_item'>
                            <span className='item_title'>商品详情：</span>
                            <span dangerouslySetInnerHTML={{__html:detail}}></span>
                        </span>
                    </List.Item>
                </List>
            </Card>
        );
    }

    async componentDidMount(){
        //获取一级/二级分类id
        const {categoryId,pCategoryId}=this.props.location.state;
        if(pCategoryId==='0'){//一级分类,只需要获取一个分类名称
            let data=await reqCategoryName(categoryId);
            console.log(data);   
        }else{//二级分类，需要获取一级和二级分类名称，cName1-->cName2
            let results=await Promise.all([reqCategoryName(pCategoryId),reqCategoryName(categoryId)]);
            const cName1=results[0].data.name;
            const cName2=results[1].data.name;
            this.setState({cName1,cName2});
        }
    }
}

export default ProductDetail;