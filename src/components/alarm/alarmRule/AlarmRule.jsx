import React, {Component} from 'react';
import './AlarmRule.less';

import axios from 'axios';
import {Row, Col, Input, Icon, Button, notification, Form, Select} from 'antd';

import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import AlarmRuleCreateForm from './AlarmRuleForm';
import AlarmRuleTable from './AlarmRuleTable';

import moment from 'moment';
import {urls} from "../../common/Urls";

const ALARM_RULE_URL = urls('ALARM_URL') + '/alarm/rule';

const FormItem = Form.Item;
const Option = Select.Option;

class AlarmRuleInner extends Component {
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
            key: '',
            messageType: '',
            messageChildTypeArr: [],
            dinputData: {}
        };
    }

    getData = () => {
        axios.get(ALARM_RULE_URL + '/getList', {
            params: {}
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
    notifyError = (text) => {
        notification['error']({
            message: text || '操作失败'
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
    handleSaveAndUpdate = () => {

        const {dataSource} = this.state;
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            this.dealValues(values);

            axios.post(ALARM_RULE_URL + '/save', values)
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

    dealValues = (values) => {
        console.log(values);
        if (values.alarmRule.id) {
            values.alarmRule.id = values.alarmRule.id;
        }
        values.alarmRule.startTime = values.alarmRule.startTime.format('HH:mm:ss');
        values.alarmRule.endTime = values.alarmRule.endTime.format('HH:mm:ss');
        values.alarmRule.description = 'todo';
    };

    //取消
    handleCancel = () => {
        this.setState({visible: false});
    };

    //单个删除
    onDelete = (record) => {
        console.log(record.id);

        var params = new URLSearchParams();
        params.append('id', record.id);

        axios.post(ALARM_RULE_URL + "/delete", params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then((response) => {
                if (response.data.code == 0) {
                    this.notifySuccess();
                    this.getData();
                } else {
                    this.notifyError(response.data.msg);
                }
            })
            .catch(function (error) {
                this.notifyError();
            });
    };

    //点击修改
    editClick = (record) => {
        console.log(record.id);
        axios.get(ALARM_RULE_URL + "/detail?id=" + record.id)
            .then((response) => {
                if (response.data.code == 0) {
                    console.log(response);
                    const dataobj = response.data.data;
                    const form = this.form;

                    form.setFieldsValue({
                        'alarmRule.id': dataobj.alarmRule.id,
                        'alarmRule.name': dataobj.alarmRule.name,
                        'alarmRule.appName': dataobj.alarmRule.appName,
                        'alarmRule.ruleType': dataobj.alarmRule.ruleType ? dataobj.alarmRule.ruleType + '' : '',
                        'alarmRule.ruleFragment': dataobj.alarmRule.ruleFragment,
                        'alarmRule.startTime': moment(dataobj.alarmRule.startTime, 'HH:mm:ss'),
                        'alarmRule.endTime': moment(dataobj.alarmRule.endTime, 'HH:mm:ss'),
                        'alarmRule.director': dataobj.alarmRule.director,
                        'alarmRule.userId': dataobj.alarmRule.userId,
                        'alarmRule.typeId': dataobj.alarmRule.typeId,
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
                console.log(error);
                this.notifyError();
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

    onRef = (ref) => {
        this.child = ref
    };


    render() {
        const {dataSource, visible, isUpdate, loading} = this.state;
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div>
                <BreadcrumbCustom paths={['报警管理', '报警规则']}/>
                <div className='formBody'>
                    <Row gutter={16}>
                        <div className='plus' onClick={this.CreateItem}>
                            <Icon type="plus-circle"/>
                        </div>
                    </Row>
                    <AlarmRuleTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        onDelete={this.onDelete}
                        editClick={this.editClick}
                        loading={loading}
                        pageChange={this.pageChange}
                    />
                    {isUpdate ?
                        <AlarmRuleCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                                                   onRef={this.onRef}
                                                   onCreate={this.handleSaveAndUpdate} title="修改" okText="更新"
                        /> :
                        <AlarmRuleCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                                                   onRef={this.onRef}
                                                   onCreate={this.handleSaveAndUpdate} title="新建" okText="创建"
                        />}
                </div>
            </div>
        )
    }
}

const AlarmRule = Form.create()(AlarmRuleInner);
export default AlarmRule;