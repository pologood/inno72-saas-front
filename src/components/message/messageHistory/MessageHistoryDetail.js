import React, {Component} from 'react';
import {Button, Modal, Form, Input, Radio, TimePicker, Select, Row, Col} from 'antd';
import moment from 'moment';
import './MessageHistory.less';

import {msgType, childTypeText} from '../common/Message';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const {TextArea} = Input;

class MessageHistoryDetail extends Component {
    state = {
        arrInput: {}
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {visible, onCancel, title, messageHistory} = this.props;
        return (
            <Modal
                width={800}
                visible={visible}
                title={title}
                onCancel={onCancel}
            >
                <div>
                    <Row>
                        <Col span={4}>Code</Col>
                        <Col span={20}>{messageHistory.model ? messageHistory.model.code : ''}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>接收方</Col>
                        <Col span={20}>{messageHistory.receiver ? messageHistory.receiver : ''}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>发送时间</Col>
                        <Col span={20}>{messageHistory.sentTime ? messageHistory.sentTime : ''}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>类型</Col>
                        <Col span={20}>{msgType(messageHistory.model ? messageHistory.model.messageType : '')}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>子类型</Col>
                        <Col span={20}>{childTypeText(messageHistory.model ? messageHistory.model.messageType + '-' + messageHistory.model.messageChildType : '')}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>结果</Col>
                        <Col span={20}>{messageHistory.result ? messageHistory.result : ''}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>模板内容</Col>
                        <Col span={20}>{messageHistory.model ? JSON.stringify(messageHistory.model.content.content) : ''}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>消息体</Col>
                        <Col span={20}>{messageHistory.content ? JSON.stringify(messageHistory.content): ''}</Col>
                    </Row>
                </div>
            </Modal>
        );
    }
}

export default MessageHistoryDetail;