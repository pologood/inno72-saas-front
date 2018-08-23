import React, { Component } from 'react';
import { Table, Icon, Popconfirm } from 'antd';
import {notification} from "antd/lib/index";

export default class AlarmUserTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { onDelete, editClick, dataSource, loading, pageChange } = this.props;

        const columns = [{
            title: '用户名称',
            dataIndex: 'name'
        }, {
            title: '联系方式',
            dataIndex: 'contact',
            width:1000
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
