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

        console.log('dataSource is ' + dataSource);
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
