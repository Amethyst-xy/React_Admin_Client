import React, { Component } from 'react';
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {BASE} from '../../utils/constants';


class MediaComponent extends React.Component {
    render() {
      const { block, contentState } = this.props;
      const data = contentState.getEntity(block.getEntityAt(0)).getData();
      

      const emptyHtml = ' ';
      return (
        <div>
          {emptyHtml}
          <img
            src={data.src}
            alt={data.alt || ''}
            style={{height: data.height || 'auto', width: data.width || 'auto'}}
          />
        </div>
      );
    }
  }

function myBlockRenderer(contentBlock) {
    const type = contentBlock.getType();

    // 图片类型转换为mediaComponent
    if (type === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
        props: {
          foo: 'bar',
        },
      };
    }
  }





const editorStyle={
    width:"100%",
    minHeight:150,
    paddingLeft:10,
    border: "1px solid #000"
};

class RichTextEditor extends Component {
    constructor(props) {
        super(props);
        const html = props.detail;
        if (html) {
          const contentBlock = htmlToDraft(html);
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          this.state = {
            editorState,
          };
        }else{
            this.state = {
                editorState: EditorState.createEmpty(),
            };
        }
    }

    //当内容改变时更新状态
    onEditorStateChange = (editorState) => {
        this.setState({
        editorState,
        });
    };

    //从本地上传图片
    uploadImageCallBack(file) {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', BASE+'/manage/img/upload');
                xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    resolve({data:{link:response.data.url}});
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    //生成并获取标签文本
    getContentToHtml(){
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    }


    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    blockRendererFn={myBlockRenderer}
                    editorStyle={editorStyle}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />
            </div>
        )
    }
}

export default RichTextEditor;
