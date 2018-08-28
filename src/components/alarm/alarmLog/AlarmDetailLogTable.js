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
                dataSource={dataSource.list}
                bordered={true}
                scroll={{x: '100%'}}
                className='formTable'
                loading={loading}
                rowKey={id => dataSource.list.id}
                pagination={{  //分页
                    total: dataSource.total, //数据总数量
                    pageSize: dataSource.pageSize,  //显示几条一页
                    // showSizeChanger: true,  //是否显示可以设置几条一页的选项
                    showTotal: function () {  //设置显示一共几条数据、
                        return '共 ' + dataSource.total + ' 条数据';
                    },
                    onShowSizeChange(current, pageSize) {  //当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
                        pageChange(current, pageSize)
                    },
                    onChange(current) {  //点击改变页数的选项时调用函数，current:将要跳转的页数
                        pageChange(current)
                    }
                }}
            />
        )
    }
}
