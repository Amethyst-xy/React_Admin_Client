import React, { Component } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeletePicture } from "../../api";
import {BASE_URL} from '../../utils/constants';

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

class PicturesWall extends Component {
    state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList:[]
    };
  
    handleCancel = () => this.setState({ previewVisible: false });
  
    handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
  
      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
    };
  
    //上传/删除图片
    handleChange = async ({ file,fileList }) => {
        if(file.status==='done'){//上传成功
            //获取图片上传成功后的response
            let res=file.response;
            if(res.status===0){
                message.success('图片上传成功',1);
                const {name,url}=res.data;
                file=fileList[fileList.length-1];
                file.name=name;
                file.url=url;
            }else{
                message.error('图片上传失败',1);
            }
        }else if(file.status==='removed'){//删除图片
            const res=await reqDeletePicture(file.name);
            if(res.status===0){
                message.success('图片删除成功');
            }else{
                message.error('图片删除失败');
            }
        }
        this.setState({fileList});
    }

    //获取所有已上传图片的名称
    getImgsName=()=>{
        let arr=this.state.fileList.map(item=>item.name);
        return arr;
    }

    UNSAFE_componentWillMount(){
        const imgs=this.props.imgs;
        if(imgs&&imgs.length>0){
          const fileList=imgs.map((item,index)=>({
            uid: -index,
            name: item,
            status: 'done',
            url: BASE_URL+item,
          }));
          this.setState({fileList});
        }
    }
  
    render() {
      const { previewVisible, previewImage, fileList, previewTitle } = this.state;
      const uploadButton = (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      );
      return (
        <>
          <Upload
            action="/api/manage/img/upload"//上传图片的接口地址
            accept='image/*'//只接收的图片地址
            name='image'//请求参数名
            listType="picture-card"//卡片样式
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length >= 3 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </>
      );
    }
  }

export default PicturesWall;