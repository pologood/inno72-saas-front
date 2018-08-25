import React, {Component} from 'react';
import {Table, Icon, Popconfirm} from 'antd';
import {notification} from "antd/lib/index";

export default class AlarmDetailLogTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {detailClick, dataSource, loading, pageChange} = this.props;

        const columns = [{
            title: '创建时间',
            dataIndex: 'createTime',
            width: 200
        }, {
            title: '报警内容',
            dataIndex: 'content'
        }];
        return (
            <Table
                columns={columns}
                dataSource={dataSource.data}
                bordered={true}
                scroll={{x: '100%'}}
                className='formTable'
                loading={loading}
                rowKey={id => dataSource.data.id}
            />
        )
    }
}
