import React, { Component } from 'react';
import { Table, Icon, Popconfirm } from 'antd';
import {notification} from "antd/lib/index";
import {msgTypeText} from "../../message/common/Message";

const ruleType = {
    '1' : '关键字',
    '2' : '正则表达式'
};

export default class AlarmRuleTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { onDelete, editClick, dataSource, loading, pageChange } = this.props;

        const columns = [{
            title: '规则名称',
            dataIndex: 'name'
        }, {
            title: '应用名称',
            dataIndex: 'appName'
        }, {
            title: '报警类型',
            dataIndex: 'ruleType',
            render: (text, record) => (
                ruleType[text]
            )
        },  {
            title: '报警规则内容',
            dataIndex: 'ruleFragment'
        } , {
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
                dataSource={dataSource.data}
                bordered={true}
                scroll={{x:'100%'}}
                className='formTable'
                loading={loading}
                rowKey={id => dataSource.data.id}
            />
        )
    }
}
