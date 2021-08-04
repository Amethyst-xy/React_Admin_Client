import React, { Component } from "react";
import './index.less';
import {getWeather} from "../../api";
import {dateFormat} from "../../utils/dateUtils";
import { withRouter } from "react-router-dom";
import menulist from "../../config/menuConfig";
import LinkButton from '../../components/link_button/link_button';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

const { confirm } = Modal;


class Header extends Component {

    constructor(props){
        super(props);

        this.state={
            time:'',
            province:'',
            city:'',
            temperature:'',
            weather:''
        }
    }

    showWeather=async (cityCode)=>{
       this.weather=await getWeather(cityCode);
       this.setState(this.weather);
    }

    showDate=()=>{
        setInterval(()=>{
            const time=dateFormat();
            this.setState({time});
        },1000);
    }
    
    getTitle=()=>{
        let title;
        let path=this.props.location.pathname;
        menulist.forEach(item=>{
            if(item.key===path){
                title=item.title;
            }else if(item.children){
                const cItem=item.children.find(i=>path.indexOf(i.key)===0);
                if(cItem){
                    title=cItem.title;
                }
            }
        })
        return title;
    }

    showConfirm=()=>{
        confirm({
            title: '你确定要退出吗?',
            icon: <ExclamationCircleOutlined />,
            onOk:()=>{
                //删除memoryUtils和storageUtils中的信息
                storageUtils.removeUser();
                memoryUtils.user={};

                //跳转到登录页面
                this.props.history.replace('/login');
            }
          });
    }

    UNSAFE_componentWillMount(){
        this.username=memoryUtils.user.username;
    }

    render() {
        const title=this.getTitle();
        const {time,province,city,temperature,weather}=this.state;
        
        return (
            <div className='header'>
                <div className='header_top'>
                    <span>欢迎</span>
                    <span className='header_user'>{this.username}</span>
                    <LinkButton onClick={this.showConfirm}>退出</LinkButton>
                </div>
                <div className='header_bottom'>
                    <div className='bottom_left'>{title}</div>
                    <div className='bottom_right'>
                        <span>{time}</span>
                        <span>{province}省</span>
                        <span>{city}</span>
                        <span>{temperature}℃</span>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){
        this.setState({time:dateFormat()});
        this.showWeather('510100');
        this.showDate();
    }
    
}

export default withRouter(Header);