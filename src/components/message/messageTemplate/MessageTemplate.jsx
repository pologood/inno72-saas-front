import React, {Component} from 'react';
import './messageTemplate.less';

import axios from 'axios';
import {Row, Col, Input, Icon, Button, notification, Form, Select} from 'antd';

import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import MessageTemplateCreateForm from './MessageTemplateForm';
import MessageTemplateTable from './MessageTemplateTable';

import moment from 'moment';

// var MSGTEMPLATE_URL = "http://api.msg.inner.72solo.com/msgTemplate";
var MSGTEMPLATE_URL = "http://msg.pinwheelmedical.com/msgTemplate";

const FormItem = Form.Item;
const Option = Select.Option;

const MSG_TYPE_WECHAT = '1';
const MSG_TYPE_DDGROUP = '2';
const MSG_TYPE_MSG = '3';
const MSG_TYPE_PUSH = '4';
const MSG_TYPE_EMAIL = '5';
const MSG_TYPE_ROBOT = '6';

var inputMap = new Map();

class MessageTemplateInner extends Component {
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
            dinputData : {}
        };
    }

    getData = () => {
        axios.get(MSGTEMPLATE_URL, {
            params: {
                page: this.state.pageNo,
                size: this.state.pageSize,
                key : this.state.key,
                messageType : this.state.messageType
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
    handleSearch = e => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.setState({
                page: 0,
                key: fieldsValue.key ? fieldsValue.key : '',
                messageType: fieldsValue.messageType ? fieldsValue.messageType : ''
            }, () => {
                this.getData();
            });
        });
    };

    // 选择消息类型
    handleChange = value => {
        console.log(value);
    };


    // todo
    handleDinputHandle = e => {

        console.log(e.target.value);

        // inputMap.set('keyword1', {"value": "keyword1", "color": "#173177"});
        // inputMap.set('keyword2', {"value": "keyword2", "color": "#173177"});
        //
        // console.log(this.mapToJson(inputMap));
        //
        // this.setState({
        //     dinputData: {
        //         "keyword1": {
        //             "value": "keyword1",
        //             "color": "#173177"
        //         }
        //     }
        // })
    };

    mapToJson = (map) => {
        return JSON.stringify([...map]);
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

            this.dealValues(values);

            // axios.post(MSGTEMPLATE_URL, values)
            //     .then((response) => {
            //         if (response.data.code == 0) {
            //             this.notifySuccess();
            //             this.handleCancel();
            //             this.getData();
            //         } else {
            //             this.notifyError();
            //         }
            //     })
            //     .catch(function (error) {
            //         this.notifyError();
            //     });
        });
    };

    dealValues = (values) => {
        console.log('dealValues' + this.state.dinputData);

        values.sendTime.include.start = values.sendTime.include.start.format('HH:mm:ss');
        values.sendTime.include.end = values.sendTime.include.end.format('HH:mm:ss');
        if (values.messageType == MSG_TYPE_ROBOT) {
            values.receiver = values.robotToken;
        }
        if (values.messageType == MSG_TYPE_DDGROUP) {
            values.receiver = values.groupId;
        }
        if (values.messageType != MSG_TYPE_ROBOT && values.messageType != MSG_TYPE_DDGROUP) {
            values.receiver = '';
        }
        if (values.messageType != MSG_TYPE_PUSH) {
            values.content.transmissionType = '';
            values.content.templateType = '';
            values.content.osType = '';
        }
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
        axios.get(MSGTEMPLATE_URL + "/WC_NEWGOODS_RECOM_UNDER_SCAN_MSG")
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
            this.dealValues(values);
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
        const {dataSource, visible, isUpdate, loading} = this.state;
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div>
                <BreadcrumbCustom paths={['首页', '表单']}/>
                <div className='formBody'>
                    <Form onSubmit={this.handleSearch}>
                        <Row gutter={16}>
                            <Col className="gutter-row" sm={4} md={2}>
                                {getFieldDecorator('messageType')(
                                <Select placeholder="请选择" style={{ width: 95 ,paddingTop:3.5}} onChange={this.handleChange}>
                                    <Option value="">全部</Option>
                                    <Option value="1">微信</Option>
                                    <Option value="2">钉钉群</Option>
                                    <Option value="3">短信</Option>
                                    <Option value="4">推送</Option>
                                    <Option value="5">邮件</Option>
                                    <Option value="6">钉钉机器人</Option>
                                </Select>
                                )}
                            </Col>
                            <Col className="gutter-row" sm={5}>
                                <FormItem>
                                    {getFieldDecorator('key')(<Input placeholder="名称/Code" />)}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <div className='plus' onClick={this.CreateItem}>
                                <Icon type="plus-circle"/>
                            </div>

                            <div className='btnOpera'>
                                <Button type="primary" htmlType="submit"
                                        style={{marginRight: '10px'}}>查询</Button>
                            </div>
                        </Row>
                    </Form>
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
                                                   onCreate={this.handleUpdate} title="修改" okText="更新" handleDinputHandle={this.handleDinputHandle}
                        /> :
                        <MessageTemplateCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                                                   onCreate={this.handleCreate} title="新建" okText="创建"
                        />}
                </div>
            </div>
        )
    }
}
const MessageTemplate = Form.create()(MessageTemplateInner);
export default MessageTemplate;