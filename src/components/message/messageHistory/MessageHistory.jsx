import React, {Component} from 'react';
import './MessageHistory.less';

import axios from 'axios';
import {Row, Col, Input, Icon, Button, notification, Form, Select} from 'antd';

import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import MessageHistoryDetail from './MessageHistoryDetail';
import MessageHistoryTable from './MessageHistoryTable';

import moment from 'moment';

var MSGTEMPLATE_URL = "http://msg.pinwheelmedical.com/msg";
// var MSGTEMPLATE_URL = "http://msg.pinwheelmedical.com/msgTemplate";

const FormItem = Form.Item;
const Option = Select.Option;

class MessageHistoryInner extends Component {
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
            messageHistory:{}
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
            console.log(response.data);
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
                messageType: fieldsValue.messageType ? fieldsValue.messageType : '',
                messageChildType: fieldsValue.messageChildType ? fieldsValue.messageChildType : ''
            }, () => {
                this.getData();
            });
        });
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

    //取消
    handleCancel = () => {
        this.setState({visible: false});
    };

    //点击查看详情
    detailClick = (record) => {
        console.log(record.id);
        axios.get(MSGTEMPLATE_URL + "/" + record.id)
            .then((response) => {
                if (response.data.code == 0) {
                    console.log(response);

                    let dataobj = response.data.data;

                    this.setState({
                        messageHistory: dataobj
                    });

                    console.log(dataobj);

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

    render() {
        const {dataSource, visible, loading, messageHistory} = this.state;
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div>
                <BreadcrumbCustom paths={['消息管理', '历史消息']}/>
                <div className='formBody'>
                    <Form onSubmit={this.handleSearch}>
                        <Row gutter={16}>
                            <Col className="gutter-row" sm={5}>
                                <FormItem>
                                    {getFieldDecorator('key')(<Input placeholder="名称/Code" />)}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row gutter={16}>

                            <div className='btnOpera'>
                                <Button type="primary" htmlType="submit"
                                        style={{marginRight: '10px'}}>查询</Button>
                            </div>
                        </Row>
                    </Form>
                    <MessageHistoryTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        detailClick={this.detailClick}
                        loading={loading}
                        pageChange={this.pageChange}
                    />

                    <MessageHistoryDetail visible={visible} messageHistory={messageHistory} onCancel={this.handleCancel}
                                               title="详情"
                    />
                </div>
            </div>
        )
    }
}
const MessageHistory = Form.create()(MessageHistoryInner);
export default MessageHistory;