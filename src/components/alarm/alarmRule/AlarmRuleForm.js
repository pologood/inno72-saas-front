import React, {Component} from 'react';
import {Button, Modal, Form, Input, Radio, TimePicker, Select} from 'antd';
import moment from 'moment';
import './AlarmRule.less';
import {notification} from "antd/lib/index";
import axios from "axios/index";
import {urls} from "../../common/Urls";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const ALARM_NOTIFY_TYPE_URL = urls('ALARM_URL') + '/alarm/msg/type';
const ALARM_USER_URL = urls('ALARM_URL') + '/alarm/user';

class AlarmRuleForm extends Component {
    state = {
        userId: [],
        typeId: [],
        directors : []
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.initUser();
        this.initNotifyType();
    }

    componentWillReceiveProps(nextProps) {
        const {form} = nextProps;
    }

    initUser = () => {
        axios.get(ALARM_USER_URL + '/getList', {
            params: {
            }
        })
        .then((response) => {
            console.log(response.data.data);
            let users = response.data.data;
            let userArr = [];
            for (let i in users) {
                userArr.push({id: users[i].id, name: users[i].name});
            }
            this.setState({
                userId: userArr,
                directors : userArr
            });
        })
        .catch(function (error) {
        });
    };

    // 初始化通知方式
    initNotifyType = () => {
        axios.get(ALARM_NOTIFY_TYPE_URL + '/getList', {
            params: {}
        })
        .then((response) => {
            let typeIds = response.data.data;
            let typeIdArr = [];
            for (let i in typeIds) {
                typeIdArr.push({id: typeIds[i].id, name: typeIds[i].name});
            }
            this.setState({
                typeId: typeIdArr
            });
        })
        .catch(function (error) {
        });
    };

    render() {
        const {visible, onCancel, onCreate, form, okText, title} = this.props;
        const {getFieldDecorator} = form;
        const FormItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16},
        };

        return (
            <Modal
                width={800}
                visible={visible}
                title={title}
                okText={okText}
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="horizontal">
                    <FormItem label="规则名称" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('alarmRule.name', {
                            rules: [{required: true, message: '请输入规则名称！'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem label="应用名称" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('alarmRule.appName', {
                            rules: [{required: true, message: '请输入应用名称！'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem label="报警类型" {...FormItemLayout}>
                        {getFieldDecorator('alarmRule.ruleType', {
                            initialValue: '1'
                        })(
                            <RadioGroup onChange={this.handleMessageTypeClick}>
                                <RadioButton key="1" value="1">关键字</RadioButton>
                                <RadioButton key="2" value="2">正则表达式</RadioButton>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem label="报警内容" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('alarmRule.ruleFragment', {
                            rules: [{required: true, message: '请输入报警内容！'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem label="报警时间" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('alarmRule.startTime', {
                            initialValue: moment('00:00:00', 'HH:mm:ss')
                        })(
                            <TimePicker/>
                        )}
                        <span> 至 </span>
                        {getFieldDecorator('alarmRule.endTime', {
                            initialValue: moment('23:59:59', 'HH:mm:ss')
                        })(
                            <TimePicker/>
                        )}
                    </FormItem>

                    <FormItem label="负责人" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('alarmRule.director', {
                        })(
                            <Select placeholder="请选择">
                                {
                                    this.state.directors.map((item, index) => (
                                        <Option key={item.id}>{item.name}</Option>
                                    ))
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem label="报警消息接收人" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('alarmRule.userId', {
                            rules: [{required: true, message: '请输入消息接收人！'}],
                        })(
                            <Select
                                mode="tags"
                                style={{width: '100%'}}
                                tokenSeparators={[',']}
                            >
                                {
                                    this.state.userId.map((item, index) => (
                                        <Option key={item.id}>{item.name}</Option>
                                    ))
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="报警方式" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('alarmRule.typeId', {
                            rules: [{required: true, message: '请输入报警方式！'}],
                        })(
                            <Select
                                mode="tags"
                                style={{width: '100%'}}
                                tokenSeparators={[',']}
                            >
                                {
                                    this.state.typeId.map((item, index) => (
                                        <Option key={item.id}>{item.name}</Option>
                                    ))
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem label="" {...FormItemLayout} style={{display: 'none'}}>
                        {getFieldDecorator('alarmRule.id', {
                        })(
                            <Input/>
                        )}
                    </FormItem>

                </Form>
            </Modal>
        );
    }
}

const AlarmRuleCreateForm = Form.create()(AlarmRuleForm);
export default AlarmRuleCreateForm;