import React, { Component } from 'react';
import { Table, Icon, Popconfirm } from 'antd';

var msgChildType = new Map();
msgChildType.set(1, '微信');
msgChildType.set(2, '钉钉群');
msgChildType.set(3, '短信');
msgChildType.set(4, '推送');
msgChildType.set(5, '邮件');
msgChildType.set(6, '钉钉机器人');
msgChildType.set(7, '钉钉微应用');
msgChildType.set(8, '企业微信');

export default class FormTable extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const { onDelete, editClick, dataSource, loading } = this.props;

        const columns = [{
            title: '名称',
            dataIndex: 'name'
        }, {
            title: 'Code',
            dataIndex: 'code',
        }, {
            title: '内容',
            dataIndex: 'content.content'
        }, {
            title: '类型',
            dataIndex: 'messageType',
            render: (text, record) => (
                msgChildType.get(text)
            )
        }, {
            title: '子类型',
            dataIndex: 'messageChildType',
            width:'80px'
        },{
            title: '操作',
            dataIndex: 'opera',
            width:100,
            render: (text, record) =>
                <div className='opera'>
                    <span onClick={() => editClick(record.key)}>
                         <Icon type="edit" /> 修改
                    </span><br />
                    <span><Popconfirm title="确定要删除吗?" onConfirm={() => onDelete(record.key)}><Icon type="minus-square-o" /> 删除 </Popconfirm></span>
                </div>
        }];
        return(
            <Table
                columns={columns}
                dataSource={dataSource}
                bordered={true}
                scroll={{x:'100%'}}
                className='formTable'
                loading={loading}
                rowKey={id => dataSource.id}
            />
        )
    }
}
