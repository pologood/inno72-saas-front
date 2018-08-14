import React, {Component} from 'react';
import './messageTemplate.less';

import axios from 'axios';
import {Row, Col, Input, Icon, Cascader, DatePicker, Button, Tooltip, Popconfirm, notification} from 'antd';

import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import MessageTemplateCreateForm from './MessageTemplateForm';
import MessageTemplateTable from './MessageTemplateTable';

var MSGTEMPLATE_URL = "http://api.msg.inner.72solo.com/msgTemplate";
// var MSGTEMPLATE_URL = "http://172.16.23.207:7070/msgTemplate";

export default class MessageTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            address: '',
            timeRange: '',
            visible: false, //新建窗口隐藏
            dataSource: [],
            selectedRowKeys: [],
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            pageNo: 0,
            pageSize: 10
        };
    }

    getData = () => {
        axios.get(MSGTEMPLATE_URL, {
            params: {
                page: this.state.pageNo,
                size: this.state.pageSize
            }
        })
            .then(function (response) {
                // console.log(response.data);
                this.setState({
                    dataSource: response.data.data,
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

    //搜索按钮
    btnSearch_Click = () => {

    };

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
            axios.post(MSGTEMPLATE_URL, values)
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

    //取消
    handleCancel = () => {
        this.setState({visible: false});
    };

    //单个删除
    onDelete = (record) => {
        console.log(record.id);
        axios.delete(MSGTEMPLATE_URL + "/" + record.id)
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
        console.log(record.id);
        axios.get(MSGTEMPLATE_URL + "/" + record.id)
            .then((response) => {
                if (response.data.code == 0) {
                    console.log(response);

                    const dataobj = response.data.data;
                    const form = this.form;

                    form.setFieldsValue({
                        name: dataobj.name,
                        code: dataobj.code,
                        messageType: dataobj.messageType,
                        messageChildType: dataobj.messageChildType
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
            console.log('Received values of form: ', values);

            axios.post(MSGTEMPLATE_URL, values)
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
        const {userName, timeRange, dataSource, visible, isUpdate, loading} = this.state;
        const questiontxt = () => {
            return (
                <p>
                    <Icon type="plus-circle-o"/> : 新建信息<br/>
                    <Icon type="minus-circle-o"/> : 批量删除
                </p>
            )
        };
        return (
            <div>
                <BreadcrumbCustom paths={['首页', '表单']}/>
                <div className='formBody'>
                    <Row gutter={16}>
                        <Col className="gutter-row" sm={8}>
                            <Input
                                value={userName}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <div className='plus' onClick={this.CreateItem}>
                            <Icon type="plus-circle"/>
                        </div>

                        <div className='btnOpera'>
                            <Button type="primary" onClick={this.btnSearch_Click}
                                    style={{marginRight: '10px'}}>查询</Button>
                        </div>
                    </Row>
                    <MessageTemplateTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        onDelete={this.onDelete}
                        editClick={this.editClick}
                        loading={loading}
                        pageChange={this.pageChange}
                    />
                    {isUpdate ?
                        <MessageTemplateCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                                                   onCreate={this.handleUpdate} title="修改" okText="更新"
                        /> :
                        <MessageTemplateCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                                                   onCreate={this.handleCreate} title="新建" okText="创建"
                        />}
                </div>
            </div>
        )
    }
}