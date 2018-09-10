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
            dataIndex: 'alarmRule.name'
        },{
            title: '报警时间',
            dataIndex: 'createTime'
        },{
            title: '负责人',
            dataIndex: 'alarmRule.director'
        },{
            title: '第一次查看时间',
            dataIndex: 'firstReadTime'
        },{
            title: '解决时间',
            dataIndex: 'dealTime'
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
                dataSource={dataSource.list}
                bordered={true}
                scroll={{x:'100%'}}
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
