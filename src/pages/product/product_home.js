import React, { Component } from "react";
import { 
  Card,
  Select,
  Input,
  Button,
  Table 
} from "antd";

import {
  reqProduct,
  reqProductByNameOrDesc,
  reqOffAndOn
} from '../../api';

import { PlusOutlined } from "@ant-design/icons";
import LinkButton from '../../components/link_button/link_button';
import './index.less';
import {PAGE_SIZE} from '../../utils/constants';

const { Option } = Select;

class ProductHome extends Component{

  constructor(props){
    super(props);
    this.state={
      total:'',//商品列表总条数
      productlist:[],//商品列表
      isloading:true,
      current:1,//当前页
      searchType:'name',//搜索方式
      searchNameOrDesc:'',
    }
  }

  //初始化表格
  initTable(){
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render:(price)=>'￥'+price
      },
      {
          title: '状态',
          render:(product)=>(
            product.status===1?(
              <div>
                <LinkButton
                  onClick={()=>{this.productOffAndOn(product._id,product.status)}}
                ><p className='add_product putdown'>下架</p></LinkButton><br/>
                在售           
              </div>
            ):(
              <div>
                <LinkButton
                  onClick={()=>{this.productOffAndOn(product._id,product.status)}}
                ><p className='add_product putdown'>上架</p></LinkButton><br/>
                已下架         
              </div>
            )
          )
        },
        {
          title: '操作',
          render:(product)=>(
            <div>
              {/* 将product对象使用state传递给目标路由组件 */}
              <LinkButton onClick={()=>{this.props.history.push('/product/detail',product)}}>详情</LinkButton><br/>
              <LinkButton onClick={()=>{this.props.history.push('/product/add_update',product)}}>修改</LinkButton>
            </div>
          )
        },
    ];
  }

  //获取商品信息，获取当前页数据，
  //换页的时候重新发送请求，页数由条目总数total决定
  async getProduct(pageNum){
    this.pageNum=pageNum;//将pageNum暴露出来，在其他地方可以使用
    const {searchType,searchNameOrDesc}=this.state;
    this.setState({isloading:true});
    let data;
    //搜索框有内容，按照Id/Name搜索
    if(searchNameOrDesc){
      console.log(searchType);
      let productType=searchType==='name'?'productName':'productDesc';
      data=await reqProductByNameOrDesc(pageNum,PAGE_SIZE,searchNameOrDesc,productType);
    }else{
      //搜索框没有内容，一般搜索
      data=await reqProduct(pageNum,PAGE_SIZE);
    }
    this.setState({productlist:data.data.list,total:data.data.total,isloading:false});
  }

  //处理换页
  handleChange(cur){
    this.getProduct(cur);
    this.setState({current:cur});
  }

  //对商品进行上下架处理
  async productOffAndOn(productId,status){
    status=status===0?1:0;
    let data=await reqOffAndOn(productId,status);
    if(!data.status){
      this.getProduct(this.pageNum);
    }
  }

  UNSAFE_componentWillMount(){
    this.initTable();
  }

    render(){
        const {total,productlist,isloading,searchType,current}=this.state;
        this.cur=current;
        const extra=(
            <LinkButton onClick={()=>{this.props.history.push('/product/add_update')}}>
                <span className='add_product'>
                    <PlusOutlined className='icon'/> 
                    添加商品
                </span>
            </LinkButton>
        );
        const title=(
            <div>
                <Select 
                    value={searchType}
                    onChange={(value)=>{this.setState({searchType:value})}}
                    
                >
                    <Option value="name">按名称搜索</Option>
                    <Option value="desc">按描述搜索</Option>
                </Select>
                <Input 
                  style={{width:"120px",margin:"0 10px"}} 
                  placeholder="关键字"
                  onChange={(e)=>{this.setState({searchNameOrDesc:e.target.value})}}  
                />
                <Button 
                  style={{background:"#1DA57A",color:"#fff"}}
                  onClick={()=>{this.getProduct(1)}}
                >搜索</Button>
            </div>

        );
        return (
            <Card 
              title={title}
              extra={extra}
              style={{ width: "100%",minHeight:"100%" }}
            >
              <Table 
                loading={isloading}
                dataSource={productlist} 
                columns={this.columns} 
                pagination={{
                  total:total&&total,
                  pageSize:PAGE_SIZE,
                  current:this.cur,
                  showQuickJumper:true,
                  onChange:(cur)=>{this.handleChange(cur)}
                }}
                rowKey="name"
              />
            </Card>
        )
    }

    //显示第一页数据
    componentDidMount(){
      this.getProduct(1);
    }
}

export default ProductHome;