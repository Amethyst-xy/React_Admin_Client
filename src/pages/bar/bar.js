import React, { Component } from "react";
import { Card,Button } from "antd";
import ReactECharts from "echarts-for-react";

class Bar extends Component{
    //配置项
    getOption=()=>{
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
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
                {type: 'bar'},
                {type: 'bar'},
                {type: 'bar'}
            ]
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

export default Bar;