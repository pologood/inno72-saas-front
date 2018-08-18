import React, {Component} from 'react';
import {Button, Modal, Form, Input, Radio, TimePicker, Select} from 'antd';
import moment from 'moment';
import './messageTemplate.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const {TextArea} = Input;

const MSG_TYPE_WECHAT = '1';
const MSG_TYPE_DDGROUP = '2';
const MSG_TYPE_MSG = '3';
const MSG_TYPE_PUSH = '4';
const MSG_TYPE_EMAIL = '5';
const MSG_TYPE_ROBOT = '6';

const MSG_CHILD_TYPE_TEXT = '1';
const MSG_CHILD_TYPE_TEMPLATE = '2';


class MessageTemplateForm extends Component {
    state = {
        arrInput: [],
        messageType: '',
        messageChildType: '',
        messageChildTypeArr: [
            {'name': '文本', 'val': '1'},
            {'name': '微信模板', 'val': '2'}
        ],
        isShowContent: 'none',
        isShowMessageChildType: '',
        isShowWechatTemplate: 'none',
        isShowRobotToken: 'none',
        isShowPushBody: 'none',
        isShowGroupId: 'none'
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }

    getArrInput = () => {
       return this.state.arrInput;
    };

    handleDinputHandle = e => {
        console.log(this.state.arrInput);

        let nameArr = e.target.name.split('-');

        let name = nameArr[0];
        let index = nameArr[1];

        if (name == 'name') {
            this.state.arrInput[index].value = e.target.value;
        } else if (nameArr[0] == 'color') {
            this.state.arrInput[index].color = e.target.value;
        }
        this.setState({
            arrInput : this.state.arrInput
        });
    };

    handleMessageTypeClick = e => {
        this.setState({messageType: e.target.value}, () => {
            this.showHide()
        });
    };

    handleMessageChildTypeClick = e => {
        this.setState({messageChildType: e.target.value},
            () => {
                this.showHide();
            });
    };

    addInput = () => {
        this.setState({arrInput: [...this.state.arrInput, {value:'', color:''}]})
    };

    componentWillReceiveProps(nextProps) {
        const {form} = nextProps;

        let datas = form.getFieldValue('content.data.data');
        let dataArr = [];
        let dataArrKey = [];
        for (var i in datas) {
            dataArrKey.push(i);
        }

        dataArrKey.sort();

        dataArrKey.map(function(key){
            dataArr.push(datas[key]);
        });
        console.log(dataArr);
        this.setState({
            arrInput: dataArr,
            messageType: form.getFieldValue('messageType'),
            messageChildType: form.getFieldValue('messageChildType'),
        }, () => {
            this.showHide();
        });
    }

    showHide = () => {
        let messageType = this.state.messageType;
        let messageChildType = this.state.messageChildType;

        if (messageType == MSG_TYPE_WECHAT) {
            this.setState({
                messageChildTypeArr: [
                    {'name': '文本', 'val': '1'},
                    {'name': '微信模板', 'val': '2'}
                ]
            });
        }
        if (messageType == MSG_TYPE_DDGROUP || messageType == MSG_TYPE_ROBOT) {
            this.setState({
                messageChildTypeArr: [
                    {'name': '文本', 'val': '1'},
                    {'name': '链接', 'val': '2'}
                ]
            });
        }
        if (messageType == MSG_TYPE_MSG) {
            this.setState({
                messageChildTypeArr: [
                    {'name': '云片', 'val': '1'}
                ]
            });
        }

        if (messageType == MSG_TYPE_WECHAT && messageChildType == MSG_CHILD_TYPE_TEMPLATE) {
            this.setState({isShowContent: 'none', isShowWechatTemplate: ''});
        } else {
            this.setState({isShowContent: '', isShowWechatTemplate: 'none'});
        }

        if (messageType == MSG_TYPE_EMAIL || messageType == MSG_TYPE_PUSH) {
            this.setState({isShowMessageChildType: 'none'});
        } else {
            this.setState({isShowMessageChildType: ''});
        }

        if (messageType == MSG_TYPE_ROBOT) {
            this.setState({isShowRobotToken: ''});
        } else {
            this.setState({isShowRobotToken: 'none'});
        }

        if (messageType == MSG_TYPE_PUSH) {
            this.setState({isShowPushBody: ''});
        } else {
            this.setState({isShowPushBody: 'none'});
        }

        if (messageType == MSG_TYPE_DDGROUP) {
            this.setState({isShowGroupId: ''});
        } else {
            this.setState({isShowGroupId: 'none'});
        }
    };

    render() {
        const {visible, onCancel, onCreate, form, okText, title} = this.props;
        const {getFieldDecorator} = form;
        const FormItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16},
        };

        let dbtn = [];
        let dinput = [];
        let lebelshow = 'data.keyword';
        let inputplace = 'keyword';
        let colorSuffix = '的color,默认值#173177';
        let inputName = 'name-';
        let inputColor = 'color-';

        dbtn = <Button type="primary" onClick={this.addInput}>+增加自定义参数</Button>;

        this.state.arrInput.map((item, index) => (
            dinput.push(
                <FormItem key={index} label={lebelshow + (index + 1)} {...FormItemLayout} hasFeedback>
                    <Input name={inputName + index} value={item.value} placeholder={inputplace + (index + 1)}
                           className="dynamic-input" onChange={this.handleDinputHandle}/>
                    <Input name={inputColor + index} value={item.color}
                           placeholder={inputplace + (index + 1) + colorSuffix} className="dynamic-input"
                           onChange={this.handleDinputHandle}/>
                </FormItem>
            )
        ));

        return (
            <Modal
                width={800}
                visible={visible}
                title={title}
                okText={okText}
                onCancel={onCancel}
                onOk={onCreate}
                onText={this.test}
            >
                <Form layout="horizontal">
                    <FormItem label="名称" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入名称！'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem label="Code" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('code', {
                            rules: [{required: true, message: '请输入Code！'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem label="发送时间" {...FormItemLayout}>
                        {getFieldDecorator('sendTime.include.start', {
                            initialValue: moment('00:00:00', 'HH:mm:ss')
                        })(
                            <TimePicker/>
                        )}
                        <span> 至 </span>
                        {getFieldDecorator('sendTime.include.end', {
                            initialValue: moment('23:59:59', 'HH:mm:ss')
                        })(
                            <TimePicker/>
                        )}
                    </FormItem>

                    <FormItem label="类型" {...FormItemLayout}>
                        {getFieldDecorator('messageType', {
                            initialValue: '1'
                        })(
                            <RadioGroup onChange={this.handleMessageTypeClick}>
                                <RadioButton key="1" value="1">微信</RadioButton>
                                <RadioButton key="2" value="2">钉钉群</RadioButton>
                                <RadioButton key="3" value="3">短信</RadioButton>
                                <RadioButton key="4" value="4">推送</RadioButton>
                                <RadioButton key="5" value="5">邮件</RadioButton>
                                <RadioButton key="6" value="6">机器人</RadioButton>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem label="子类型" {...FormItemLayout} style={{display: this.state.isShowMessageChildType}}>
                        {getFieldDecorator('messageChildType', {
                            initialValue: '1'
                        })(
                            <RadioGroup onChange={this.handleMessageChildTypeClick}>
                                {
                                    this.state.messageChildTypeArr.map(function (item) {
                                        return (
                                            <RadioButton key={item.id} value={item.val}>{item.name}</RadioButton>
                                        )
                                    })
                                }
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem label="机器人token" {...FormItemLayout} style={{display: this.state.isShowRobotToken}}>
                        {getFieldDecorator('robotToken', {})(
                            <Input/>
                        )}
                    </FormItem>

                    <div style={{display: this.state.isShowPushBody}}>
                        <FormItem label="是否立即启动应用" {...FormItemLayout}>
                            {getFieldDecorator('content.transmissionType', {
                                initialValue: '1'
                            })(
                                <RadioGroup>
                                    <RadioButton key='1' value='1'>是</RadioButton>
                                    <RadioButton key='2' value='2'>否</RadioButton>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem label="推送模板" {...FormItemLayout}>
                            {getFieldDecorator('content.templateType', {
                                initialValue: '1'
                            })(
                                <Select style={{width: 250}}>
                                    <Option value="1">点击通知打开应用模板</Option>
                                    <Option value="4">透传消息模板</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="推送系统" {...FormItemLayout}>
                            {getFieldDecorator('content.osType', {
                                initialValue: '1'
                            })(
                                <Select style={{width: 120}}>
                                    <Option value="1">安卓版</Option>
                                    <Option value="2">苹果基础版</Option>
                                    <Option value="3">苹果专业版</Option>
                                </Select>
                            )}
                        </FormItem>
                    </div>

                    <FormItem label="群ID" {...FormItemLayout} style={{display: this.state.isShowGroupId}}>
                        {getFieldDecorator('groupId', {})(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem label="内容" {...FormItemLayout} style={{display: this.state.isShowContent}}>
                        {getFieldDecorator('content.content', {})(
                            <TextArea rows={4}/>
                        )}
                    </FormItem>

                    <div style={{display: this.state.isShowWechatTemplate}}>
                        <FormItem label="模板ID" {...FormItemLayout} >
                            {getFieldDecorator('content.template_id', {})(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem label="默认模板跳转Url" {...FormItemLayout} >
                            {getFieldDecorator('content.url', {})(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem label="data.first" {...FormItemLayout} >
                            {getFieldDecorator('content.data.first.color', {})(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem label="data.remark" {...FormItemLayout} >
                            {getFieldDecorator('content.data.remark.color', {})(
                                <Input/>
                            )}
                        </FormItem>
                        {dbtn}
                        {dinput}
                    </div>
                </Form>
            </Modal>
        );
    }
}

const MessageTemplateCreateForm = Form.create()(MessageTemplateForm);
export default MessageTemplateCreateForm;