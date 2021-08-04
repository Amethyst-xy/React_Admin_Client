import React,{Component} from "react";
import { Form, Input } from 'antd';

class AddForm extends Component{
    onFinish=()=>{
        const data=this.form.validateFields().catch(err=>console.log(err));
        return data;
    }

    render(){
        const colLayout={
            labelCol:{span:5},
            wrapperCol:{span:9}
        }
        return (
            <Form 
                ref={form=>this.form=form}
                onFinish={this.onFinish}
            >
                <Form.Item
                    {...colLayout}
                    label='角色名称'
                    name='name'
                    rules={[
                        {required:true,message:'必须输入'}
                    ]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        );
    }
}

export default AddForm;