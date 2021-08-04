import React, { Component } from "react";
import ReactECharts from "echarts-for-react";
import { Card,Button } from "antd";

class Line extends Component{
    getOption=()=>{
        return {
            title:{
                text:'折线图'
            },
            tooltip: {
                trigger: 'axis'
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
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [2.5, 3.5, 5.5, 3, 8.5, 12, 9.5],
                type: 'line'
            }]
        };
    }
    render(){
        const title=(
            <Button style={{backgroundColor:"#1DA57A",color:"#fff"}}>更新</Button>
        );
        return (
            <Card title={title}>
                <ReactECharts option={this.getOption()}/>
            </Card>
        );
    }
}

export default Line;