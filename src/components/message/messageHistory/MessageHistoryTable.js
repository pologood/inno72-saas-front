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
childTypeText.set('1-1', '微信/文本');
childTypeText.set('1-2', '微信/模板消息');
childTypeText.set('2-1', '钉钉/文本');
childTypeText.set('2-2', '钉钉/链接');
childTypeText.set('3-1', '短信/云片');
childTypeText.set('3-2', '短信/筑望');
childTypeText.set('4-1', '推送/文本');
childTypeText.set('5-1', '邮件/文本');
childTypeText.set('6-1', '机器人/文本');
childTypeText.set('6-2', '机器人/链接');

export default class MessageHistoryTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { detailClick, dataSource, loading, pageChange } = this.props;

        const columns = [{
            title: '名称',
            dataIndex: 'model.name',
            render: (text, record) => (
                <a onClick={() => detailClick(record)}>
                    {text}
                </a>
            )
        }, {
            title: '接收方',
            dataIndex: 'receiver',
        }, {
            title: '消息类型',
            dataIndex: 'model.messageChildType',
            render: (text, record) => (
                childTypeText.get(record.model.messageType + '-' + text)
            )
        },{
            title: '发送方',
            dataIndex: 'sentBy',
            render: (text, record) => (
                text ? text.substring(0,5) + '...' : ''
            )
        }, {
            title: '状态',
            dataIndex: 'status',
            render: (text, record) => (
                text == 0 ? '成功' : '失败'
            )
        },{
            title: '状态信息',
            dataIndex: 'statusMessage',
        }, {
            title: '发送时间',
            dataIndex: 'sentTime'
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
