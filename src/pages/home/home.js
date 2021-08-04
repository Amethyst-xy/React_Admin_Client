import React, { Component, Fragment } from "react";
import { Row,Col,Card,DatePicker, Space,Statistic,Timeline  } from "antd";
import ReactECharts from "echarts-for-react";
import './index.less';
import { 
    ArrowUpOutlined, 
    ArrowDownOutlined,
    RedoOutlined,
    QuestionCircleOutlined 
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

class Home extends Component{
    getOption=()=>{
        return {
            title: {
                text: '折线图'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '邮件营销',
                    type: 'line',
                    stack: '总量',
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '联盟广告',
                    type: 'line',
                    stack: '总量',
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '视频广告',
                    type: 'line',
                    stack: '总量',
                    data: [150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name: '直接访问',
                    type: 'line',
                    stack: '总量',
                    data: [320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name: '搜索引擎',
                    type: 'line',
                    stack: '总量',
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };
    }

    getOption2=()=>{
        return {
            legend: {},
            tooltip: {},
            dataset: {
                source: [
                    ['product', '2015', '2016', '2017'],
                    ['Matcha Latte', 43.3, 85.8, 93.7],
                    ['Milk Tea', 83.1, 73.4, 55.1],
                    ['Cheese Cocoa', 86.4, 65.2, 82.5],
                    ['Walnut Brownie', 72.4, 53.9, 39.1]
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {},
            series: [
                {type: 'bar'},
                {type: 'bar'},
                {type: 'bar'}
            ]
        };
    }

    render(){
        const extra=(
            <Space direction="vertical" size={12}>
                <RangePicker />
            </Space>
        );
        return (
            <Fragment>
                <Row style={{marginTop:"30px",marginBottom:"50px",alignItems:"center"}}>
                    <Col span={6} push={1} className='top_left'>
                        <Card title='商品总量' extra={<QuestionCircleOutlined />}>
                            <div className="site-statistic-demo-card">
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Card>
                                        <Statistic
                                            value='1,129,163'
                                            valueStyle={{ color: '#445',fontWeight:"700" }}
                                            suffix={<ArrowUpOutlined style={{fontSize:"16px"}}/>}
                                        />
                                        <Statistic
                                            value='周同比10%'
                                            valueStyle={{ color: '#666',fontSize:'16px' }}
                                            suffix={<ArrowUpOutlined style={{color:"red"}}/>}
                                        />
                                        <Statistic
                                            value='日同比15%'
                                            valueStyle={{ color: '#666',fontSize:"16px" }}
                                            suffix={<ArrowDownOutlined style={{color:"green"}}/>}
                                        />
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                    <Col span={16} push={2}>
                        <ReactECharts option={this.getOption()}/>
                    </Col>
                </Row>
                <Card title='访问量' extra={extra} style={{width:"100%"}}>
                    <Row>
                        <Col span={14}>
                            <Card title='访问趋势' extra={<RedoOutlined />}>
                                <ReactECharts option={this.getOption2()}/>
                            </Card>
                        </Col>
                        <Col span={8} push={2}>
                            <Card title='任务' extra={<RedoOutlined />}>
                                <Timeline>
                                    <Timeline.Item color="green">新版本迭代会</Timeline.Item>
                                    <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
                                    <Timeline.Item color="red">
                                    <p>联调接口</p>
                                    <p>功能签收</p>
                                    </Timeline.Item>
                                    <Timeline.Item color="gray">
                                    <p>登录功能设计</p>
                                    <p>权限验证</p>
                                    <p>页面排版</p>
                                    </Timeline.Item>
                                </Timeline>                              
                            </Card>                        
                        </Col>
                    </Row>
                </Card>
            </Fragment>
        );
    }
}

export default Home;