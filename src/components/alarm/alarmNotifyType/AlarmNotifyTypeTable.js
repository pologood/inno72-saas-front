import React, { Component } from 'react';
import { Table, Icon, Popconfirm } from 'antd';
import {notification} from "antd/lib/index";

export default class AlarmNotifyTypeTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { onDelete, editClick, dataSource, loading, pageChange } = this.props;

        const columns = [{
            title: '名称',
            dataIndex: 'name'
        }, {
            title: '编码',
            dataIndex: 'key',
        },
            {
            title: '创建时间',
            dataIndex: 'todo'
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
