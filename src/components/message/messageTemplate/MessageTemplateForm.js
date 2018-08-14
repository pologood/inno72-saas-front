import React, { Component } from 'react';
import { Modal, Form, Input, Radio, InputNumber, Cascader, Select, AutoComplete, Button, Icon } from 'antd';
import axios from 'axios';

const FormItem = Form.Item;
const options = [];

class MessageTemplateForm extends Component{
    state = {
        autoCompleteResult: [],
    };
    constructor(props){
        super(props);
    }
    componentDidMount(){
        axios.get('/address')
            .then(function (response) {
                response.data.map(function(province){
                    options.push({
                        value: province.name,
                        label: province.name,
                        children: province.city.map(function(city){
                            return {
                                value: city.name,
                                label: city.name,
                                children: city.area.map(function(area){
                                    return {
                                        value: area,
                                        label: area,
                                    }
                                })
                            }
                        }),
                    })
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render(){
        const { visible, onCancel, onCreate, form, okText, title } = this.props;
        const { getFieldDecorator } = form;
        const FormItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
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
                            rules: [{ required: true, message: '请输入名称！' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="Code" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('code', {
                            rules: [{ required: true, message: '请输入Code！' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="类型" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('messageType', {
                            rules: [{ required: true, message: '请输入类型！' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="子类型" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('messageChildType', {
                            rules: [{ required: true, message: '请输入子类型！' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const MessageTemplateCreateForm = Form.create()(MessageTemplateForm);
export default MessageTemplateCreateForm;