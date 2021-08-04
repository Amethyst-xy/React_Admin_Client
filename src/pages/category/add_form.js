import React, { Component } from "react";
import { Form, Input,Select} from 'antd';
const { Option } = Select;

class AddForm extends Component{
    constructor(props){
        super(props);
        this.state={
            sign:1,
            category:'一级列表',
            categoryName:''
        }
    }


    async onFinish(){
        let data=await this.formRef.validateFields()
                .catch(err=>console.log(err))
        data&&this.setState({categoryName:data.categoryName});
        return data;
    }

    render(){
        const {category}=this.props;
        
        return (
            <Form 
                ref={formRef=>this.formRef=formRef}
                onFinish={this.onFinish}
            >
                <Form.Item>
                    <p>所属分类：</p>
                    <Select 
                        defaultValue='一级列表'
                        placeholder="Select a option and change input text above"
                        onChange={(value)=>{this.setState({category:value})}}
                        allowClear
                        ref={selection=>this.selection=selection}
                        >
                            <Option value="一级列表" key="first_level_list">一级列表</Option>
                        {
                            category&&category.map(item=>{
                                return <Option value={item.name} key={item._id}>{item.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name='categoryName'
                    rules={[
                        {
                            required:true,
                            message:"必须输入"
                        }
                    ]}
                >
                    <Input 
                    placeholder="Input categoryName" 
                    ref={input=>this.input=input} 
                    />
                </Form.Item>
            </Form>
        );
    }

    componentDidMount(){
        this.props.onRef(this);
    }
}

export default AddForm;