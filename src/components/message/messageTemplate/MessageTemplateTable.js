import React, { Component } from 'react';
import { Table, Icon, Popconfirm } from 'antd';
import {notification} from "antd/lib/index";

let msgTypeMap = new Map();
msgTypeMap.set(1, '微信');
msgTypeMap.set(2, '钉钉群');
msgTypeMap.set(3, '短信');
msgTypeMap.set(4, '推送');
msgTypeMap.set(5, '邮件');
msgTypeMap.set(6, '机器人');

let childTypeText = new Map();
childTypeText.set('1-1', '文本');
childTypeText.set('1-2', '模板消息');
childTypeText.set('2-1', '文本');
childTypeText.set('2-2', '链接');
childTypeText.set('3-1', '云片');
childTypeText.set('3-1', '筑望');
childTypeText.set('4-1', '文本');
childTypeText.set('5-1', '文本');
childTypeText.set('6-1', '文本');
childTypeText.set('6-2', '链接');

export default class MessageTemplateTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { onDelete, editClick, dataSource, loading, pageChange } = this.props;

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
                msgTypeMap.get(text)
            )
        }, {
            title: '子类型',
            dataIndex: 'messageChildType',
            width:'80px',
            render: (text, record) => (
                childTypeText.get(record.messageType + '-' + text)
            )
        },{
            title: '操作',
            dataIndex: 'opera',
            width:100,
            render: (text, record) =>
                <div className='opera'>
                    <span onClick={() => editClick(record)}>
                         <Icon type="edit" /> 修改
                    </span><br />
                    <span><Popconfirm title="确定要删除吗?" onConfirm={() => onDelete(record)}><Icon type="minus-square-o" /> 删除 </Popconfirm></span>
                </div>
        }];
        return(
            <Table
                columns={columns}
                dataSource={dataSource.content}
                bordered={true}
                scroll={{x:'100%'}}
                className='formTable'
                loading={loading}
                rowKey={id => dataSource.content.id}
                pagination={{  //分页
                    total: dataSource.totalElements, //数据总数量
                    pageSize: dataSource.size,  //显示几条一页
                    // showSizeChanger: true,  //是否显示可以设置几条一页的选项
                    showTotal: function () {  //设置显示一共几条数据、
                        return '共 ' + dataSource.totalElements + ' 条数据';
                    },
                    onShowSizeChange(current, pageSize) {  //当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
                        pageChange(current, pageSize)
                    },
                    onChange(current) {  //点击改变页数的选项时调用函数，current:将要跳转的页数
                        console.log(current);
                        pageChange(current)
                    }
                }}
            />
        )
    }
}
