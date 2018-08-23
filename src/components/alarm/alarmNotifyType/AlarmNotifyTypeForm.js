import React, {Component} from 'react';
import {Button, Modal, Form, Input, Radio, TimePicker, Select} from 'antd';
import moment from 'moment';
import './AlarmNotifyType.less';

const FormItem = Form.Item;

class AlarmNotifyTypeForm extends Component {
    state = {
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }

    componentWillReceiveProps(nextProps) {
        const {form} = nextProps;
    }

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
                    <FormItem label="名称" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入名称！'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem label="编码" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('key', {
                            rules: [{required: true, message: '请输入编码！'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem label="" {...FormItemLayout} style={{display: 'none'}}>
                        {getFieldDecorator('id', {
                        })(
                            <Input/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const AlarmNotifyTypeCreateForm = Form.create()(AlarmNotifyTypeForm);
export default AlarmNotifyTypeCreateForm;