import React, { Component } from "react";
import { Row,Col,Button } from "antd";
import './index.less';

class NotFound extends Component{
    render(){
        return (
            <Row className='row'>
                <Col span={12} className='left'></Col>
                <Col span={12} className='right'>
                    <div className='right_con'>
                        <h1>404</h1>
                        <p>抱歉，您访问的页面不存在</p>
                        <Button 
                            className='btn'
                            onClick={()=>{this.props.history.replace('/home')}}    
                        >回到首页</Button>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default NotFound;