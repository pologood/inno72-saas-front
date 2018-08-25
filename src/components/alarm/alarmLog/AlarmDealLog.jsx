import React, {Component} from 'react';
import './AlarmLog.less';

import axios from 'axios';
import {Row, Col, Input, Icon, Button, notification, Form, Select} from 'antd';

import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import AlarmDealLogTable from './AlarmDealLogTable';
import AlarmDealLogDetail from './AlarmDealLogDetail';

import moment from 'moment';
import {urls} from "../../common/Urls";

const ALARM_DEAL_LOG_URL = urls('ALARM_URL') + '/alarm/deal/log';

const FormItem = Form.Item;
const Option = Select.Option;

class AlarmDealLogInner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, //新建窗口隐藏
            dataSource: [],
            selectedRowKeys: [],
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            pageNo: 0,
            pageSize: 10,
            key:'',
            alarmDealLog : {}
        };
    }

    getData = () => {
        axios.get(ALARM_DEAL_LOG_URL + '/getList', {
            params: {
            }
        })
        .then(function (response) {
            console.log(response.data);
            this.setState({
                dataSource: response.data,
                loading: false
            })
        }.bind(this))
        .catch(function (error) {
            console.log(error);
        })
    };

    /**
     * 成功通知
     */
    notifySuccess = () => {
        notification['success']({
            message: '操作成功'
        });
    };

    /**
     * 失败通知
     */
    notifyError = () => {
        notification['error']({
            message: '操作失败'
        });
    };

    //渲染
    componentDidMount() {
        this.getData();
    }

    //新建信息弹窗
    CreateItem = () => {
        this.setState({
            visible: true,
            isUpdate: false,
        });
        const form = this.form;
        form.resetFields();
    };

    //接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };

    //填充表格行
    handleCreate = () => {

        const {dataSource} = this.state;
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);

            var params = new URLSearchParams();
            params.append('name', values.name);
            params.append('key', values.key);

            axios.post(ALARM_DEAL_LOG_URL + '/add', values, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
                .then((response) => {
                    console.log(response);
                    if (response.data.code == 0) {
                        this.notifySuccess();
                        this.handleCancel();
                        this.getData();
                    } else {
                        this.notifyError();
                    }
                })
                .catch(function (error) {
                    this.notifyError();
                });
        });
    };

    //取消
    handleCancel = () => {
        this.setState({visible: false});
    };

    //取消并且刷新
    handleAndRefresh = () => {
        this.setState({visible: false});
        this.getData();
    };

    //单个删除
    onDelete = (record) => {
        console.log(record.id);
        axios.delete(ALARM_DEAL_LOG_URL + "/" + record.id)
            .then((response) => {
                if (response.data.code == 0) {
                    this.notifySuccess();
                    this.getData();
                } else {
                    this.notifyError();
                }
            })
            .catch(function (error) {
                this.notifyError();
            });
    };

    //点击查看详情
    detailClick = (record) => {
        axios.get(ALARM_DEAL_LOG_URL + "/detail?id=" + record.logId)
            .then((response) => {
                if (response.data.code == 0) {
                    console.log(response);
                    let dataobj = response.data.data;

                    this.setState({
                        alarmDealLog: dataobj.alarmDealLog
                    });

                    this.setState({
                        visible: true,
                        isUpdate: true,
                    });

                } else {
                    this.notifyError();
                }
            })
            .catch(function (error) {
                this.notifyError();
            });

    };

    //更新修改
    handleUpdate = () => {
        const form = this.form;

        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            axios.post(ALARM_DEAL_LOG_URL, values)
                .then((response) => {
                    if (response.data.code == 0) {
                        this.notifySuccess();
                        this.handleCancel();
                        this.getData();
                    } else {
                        this.notifyError();
                    }
                })
                .catch(function (error) {
                    this.notifyError();
                });
        });
    };

    //单选框改变选择
    checkChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys: selectedRowKeys});
    };

    //分页
    pageChange = (current, pageSize) => {
        this.setState({
            pageNo: current - 1,
            pageSize: pageSize,
        }, () => {
            this.getData();
        });
    };

    render() {
        const {dataSource, visible, isUpdate, loading, alarmDealLog} = this.state;
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div>
                <BreadcrumbCustom paths={['报警管理', '报警日志']}/>
                <div className='formBody'>
                    <AlarmDealLogTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        onDelete={this.onDelete}
                        detailClick={this.detailClick}
                        loading={loading}
                        pageChange={this.pageChange}
                    />

                    <AlarmDealLogDetail visible={visible} alarmDealLog={alarmDealLog} handleAndRefresh={this.handleAndRefresh} onCancel={this.handleCancel}
                                          title="详情"
                    />
                </div>
            </div>
        )
    }
}
const AlarmDealLog = Form.create()(AlarmDealLogInner);
export default AlarmDealLog;