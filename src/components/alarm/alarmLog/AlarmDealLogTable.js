import React, { Component } from 'react';
import { Table, Icon, Popconfirm } from 'antd';
import {notification} from "antd/lib/index";

export default class AlarmDealLogTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { onDelete, detailClick, dataSource, loading, pageChange } = this.props;

        const columns = [{
            title: '所属应用',
            dataIndex: 'appName'
        }, {
            title: '报警规则名',
            dataIndex: 'ruleName'
        },{
            title: '报警时间',
            dataIndex: 'dealTime'
        },{
            title: '负责人',
            dataIndex: 'director'
        },{
            title: '第一次查看时间',
            dataIndex: 'firstReadTime'
        },{
            title: '解决时间',
            dataIndex: 'dealLogTime'
        },{
            title: '状态',
            dataIndex: 'status',
            render: (text, record) => (
                text == '1' ? '已处理' : '未处理'
            )
        },{
            title: '操作',
            render: (text, record) =>
                <div className='opera'>
                    <span onClick={() => detailClick(record)}>
                         查看
                    </span>
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
