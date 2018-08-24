import React, {Component} from 'react';
import './AlarmNotifyType.less';

import axios from 'axios';
import {Row, Col, Input, Icon, Button, notification, Form, Select} from 'antd';

import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import AlarmNotifyTypeCreateForm from './AlarmNotifyTypeForm';
import AlarmNotifyTypeTable from './AlarmNotifyTypeTable';
import {urls} from "../../common/Urls";

import moment from 'moment';

const ALARM_NOTIFY_TYPE_URL = urls('ALARM_URL') + '/alarm/msg/type';

class AlarmNotifyTypeInner extends Component {
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
        axios.get(ALARM_NOTIFY_TYPE_URL + '/getList', {
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

    //取消
    handleCancel = () => {
        this.setState({visible: false});
    };

    //单个删除
    onDelete = (record) => {
        console.log(record.id);

        var params = new URLSearchParams();
        params.append('id', record.id);

        axios.post(ALARM_NOTIFY_TYPE_URL + "/delete", params, {
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
        axios.get(ALARM_NOTIFY_TYPE_URL + "/detail?id=" + record.id)
            .then((response) => {
                if (response.data.code == 0) {
                    console.log(response);
                    const dataobj = response.data.data;
                    const form = this.form;

                    form.setFieldsValue({
                        id: dataobj.id,
                        name: dataobj.name,
                        key: dataobj.key
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

    //更新修改
    handleSaveAndUpdate = () => {
        const form = this.form;

        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            var params = new URLSearchParams();
            if (values.id) {
                params.append('id', values.id);
            }
            params.append('name', values.name);
            params.append('key', values.key);

            axios.post(ALARM_NOTIFY_TYPE_URL + '/add', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
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

    onRef = (ref) => {
        this.child = ref
    };


    render() {
        const {dataSource, visible, isUpdate, loading} = this.state;
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div>
                <BreadcrumbCustom paths={['报警管理', '通知方式']}/>
                <div className='formBody'>
                    <Row gutter={16}>
                        <div className='plus' onClick={this.CreateItem}>
                            <Icon type="plus-circle"/>
                        </div>
                    </Row>
                    <AlarmNotifyTypeTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        onDelete={this.onDelete}
                        editClick={this.editClick}
                        loading={loading}
                        pageChange={this.pageChange}
                    />
                    {isUpdate ?
                        <AlarmNotifyTypeCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                                                   onRef={this.onRef}
                                                   onCreate={this.handleSaveAndUpdate} title="修改" okText="更新"
                        /> :
                        <AlarmNotifyTypeCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                                                   onRef={this.onRef}
                                                   onCreate={this.handleSaveAndUpdate} title="新建" okText="创建"
                        />}
                </div>
            </div>
        )
    }
}

const AlarmNotifyType = Form.create()(AlarmNotifyTypeInner);
export default AlarmNotifyType;