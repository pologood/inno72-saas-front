import React, {Component} from 'react';
import './MessageHistory.less';

import axios from 'axios';
import {Row, Col, Input, Icon, Button, notification, Form, Select, DatePicker} from 'antd';

import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import MessageHistoryDetail from './MessageHistoryDetail';
import MessageHistoryTable from './MessageHistoryTable';

import moment from 'moment';
import {urls} from "../../common/Urls";

const MESSAGEHISTORY_URL = urls('MESSAGEHISTORY_URL');

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

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
            messageHistory:{},
            status:'',
            startTime:'',
            endTime:''
        };
    }

    getData = () => {
        axios.get(MESSAGEHISTORY_URL, {
            params: {
                page: this.state.pageNo,
                size: this.state.pageSize,
                key: this.state.key,
                status: this.state.status,
                startTime:this.state.startTime,
                endTime:this.state.endTime
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
            console.log(fieldsValue);
            if (err) return;
            this.setState({
                page: 0,
                key: fieldsValue.key ? fieldsValue.key : '',
                status: fieldsValue.status ? fieldsValue.status : '',
                startTime: fieldsValue.searchTime ? fieldsValue.searchTime[0].format('YYYY-MM-DDTHH:mm:ss') : '',
                endTime: fieldsValue.searchTime ? fieldsValue.searchTime[1].format('YYYY-MM-DDTHH:mm:ss') : ''
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
        axios.get(MESSAGEHISTORY_URL + "/" + record.id)
            .then((response) => {
                if (response.data.code == 0) {
                    // console.log(response);

                    let dataobj = response.data.data;

                    this.setState({
                        messageHistory: dataobj
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
                            <Col className="gutter-row" sm={6} md={3}>
                                {getFieldDecorator('status')(
                                    <Select placeholder="请选择" style={{ width: 130 ,paddingTop:3.5}}>
                                        <Option key="0" value="">全部</Option>
                                        <Option key="1" value="0">发送成功</Option>
                                        <Option key="2" value="1">发送失败</Option>
                                    </Select>
                                )}
                            </Col>

                            <Col className="gutter-row" sm={5}>
                                <FormItem>
                                    {getFieldDecorator('key')(<Input placeholder="接受方/发送方" />)}
                                </FormItem>
                            </Col>

                            <Col className="gutter-row" sm={6}>
                                {getFieldDecorator('searchTime')(
                                    <RangePicker
                                        style={{ paddingTop:3.5}}
                                        ranges={{ 今天: [moment(), moment()], '当月': [moment(), moment().endOf('month')] }}
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder={['开始时间','结束时间']}
                                    />
                                )}
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