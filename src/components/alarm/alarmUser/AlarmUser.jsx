import React, {Component} from 'react';
import './AlarmUser.less';

import axios from 'axios';
import {Row, Col, Input, Icon, Button, notification, Form, Select} from 'antd';

import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import AlarmUserCreateForm from './AlarmUserForm';
import AlarmUserTable from './AlarmUserTable';

import moment from 'moment';

const ALARM_USER_URL = "http://pre_test.72solo.com:30516/alarm/user";

const FormItem = Form.Item;
const Option = Select.Option;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

class AlarmUserInner extends Component {
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
            messageType : '',
            messageChildTypeArr: [],
            dinputData : {}
        };
    }

    getData = () => {
        axios.get(ALARM_USER_URL + '/getList', {
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

            axios.post(ALARM_USER_URL + '/add', values, {
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

    //单个删除
    onDelete = (record) => {
        console.log(record.id);
        axios.delete(ALARM_USER_URL + "/" + record.id)
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

    //点击修改
    editClick = (record) => {
        debugger;
        console.log(record.id);
        axios.get(ALARM_USER_URL + "/" + record.id)
            .then((response) => {
                if (response.data.code == 0) {
                    console.log(response);

                    const dataobj = response.data.data;
                    const form = this.form;

                    form.setFieldsValue({
                        name: dataobj.name,
                        code: dataobj.code,
                        messageType: dataobj.messageType + '',
                        messageChildType: dataobj.messageChildType + '',
                        'sendTime.include.start': moment(dataobj.sendTime.include.start, 'HH:mm:ss'),
                        'sendTime.include.end': moment(dataobj.sendTime.include.end, 'HH:mm:ss'),
                        'content.content': dataobj.content.content,
                        'content.transmissionType': dataobj.content.transmissionType ? dataobj.content.transmissionType + '' : '1',
                        'content.templateType': dataobj.content.templateType ? dataobj.content.templateType + '' : '1',
                        'content.osType': dataobj.content.osType ? dataobj.content.osType + '' : '1',
                        robotToken: dataobj.receiver,
                        groupId: dataobj.receiver,
                        'content.template_id': dataobj.content.template_id || '',
                        'content.url': dataobj.content.url || '',
                        'content.data.first.color': dataobj.content.data && dataobj.content.data.first.color || '',
                        'content.data.remark.color': dataobj.content.data && dataobj.content.data.remark.color || '',
                        'content.data.data': dataobj.content.data && dataobj.content.data.data || [1]
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
    handleUpdate = () => {
        const form = this.form;

        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            axios.post(ALARM_USER_URL, values)
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
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div>
                <BreadcrumbCustom paths={['报警管理', '报警用户']}/>
                <div className='formBody'>
                    <AlarmUserTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        onDelete={this.onDelete}
                        editClick={this.editClick}
                        loading={loading}
                        pageChange={this.pageChange}
                    />
                    {isUpdate ?
                        <AlarmUserCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel} onRef={this.onRef}
                                                   onCreate={this.handleUpdate} title="修改" okText="更新"
                        /> :
                        <AlarmUserCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel} onRef={this.onRef}
                                                   onCreate={this.handleCreate} title="新建" okText="创建"
                        />}
                </div>
            </div>
        )
    }
}
const AlarmUser = Form.create()(AlarmUserInner);
export default AlarmUser;