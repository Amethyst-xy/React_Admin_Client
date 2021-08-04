import React, { Component } from "react";
import { Form, Input} from 'antd';

class UpdateForm extends Component{
    formRef=React.createRef();
    constructor(props){
        super(props);
        this.state={
            sign:2,
            categoryName:''
        }
    }

    //重置默认值
    resetCategoryName=()=>{
        this.formRef.current.resetFields();
    }

    //表单验证通过的回调
    async onFinish(){
        let data=await this.formRef.current.validateFields()
                .catch(err=>console.log(err))
        data&&this.setState({categoryName:data.category});
        return data;
    }

    render(){
        const {category}=this.props;
        return (
            <Form
                ref={this.formRef}
                onFinish={this.onFinish}
                initialValues={{category}}
            >
                <p>分类名称：</p>
                <Form.Item
                    name="category"
                    rules={[
                        {
                            required:true,
                            message:"必须输入"
                        }
                    ]}
                >
                    <Input 
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

export default UpdateForm;