import React, {Component} from 'react';
import './listStyle.less';

import axios from 'axios';
import {Table, Form, Tag, Row, Col, Button, Modal, Input, Radio, message, Divider, Popconfirm, Icon} from 'antd';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import {urls} from '../common/Urls';
import moment from 'moment';

const FormItem = Form.Item;

const CRONTAB_LIST_URL = urls('CRONTAB_URL') + '/jobgroup';
const CRONTAB_SAVE_URL = urls('CRONTAB_URL') + '/jobgroup/save';
const CRONTAB_UPDATE_URL = urls('CRONTAB_URL') + '/jobgroup/update';
const CRONTAB_REMOVE_URL = urls('CRONTAB_URL') + '/jobgroup/remove';


const CollectionCreateForm = Form.create()(
    class extends React.Component {

        constructor(){
            super();
            this.state = {
                registerMode:0
            };
        }

        registerModeOnChange(e){
            console.log(e);
            this.setState ({
                registerMode: e.target.value
            });
        }

        render() {
        const { visible, onCancel, onCreate, form, title } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
            visible={visible}
            title={title}
            okText="保存"
            cancelText="取消"
            onCancel={onCancel}
            onOk={onCreate}
            >
            <Form layout="vertical">
                <FormItem label="应用名称">
                {getFieldDecorator('appName', {
                    rules: [{ required: true, message: '请输入!' }],
                })(
                    <Input placeholder="请输入"/>
                )}
                </FormItem>
                <FormItem label="标题">
                {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入!' }],
                })(
                    <Input placeholder="请输入"/>
                )}
                </FormItem>
                <FormItem label="注册模式" className="collection-create-form_last-form-item">
                {getFieldDecorator('addressType', {
                    rules: [{ required: true, message: '请选择!' }],
                    initialValue: 0,
                })(
                    <Radio.Group onChange={this.registerModeOnChange.bind(this)}>
                    <Radio value={0}>自动注册</Radio>
                    <Radio value={1}>手动录入</Radio>
                    </Radio.Group>
                )}
                </FormItem>
                <FormItem label="注册地址">
                {getFieldDecorator('addressList', {
                    rules: [{required: this.state.registerMode === 1 ,message: '请输入!' }],
                })(
                    <Input disabled={this.state.registerMode === 0} placeholder="例：127.0.0.1,192.168.0.1"/>
                )}
                </FormItem>
            </Form>
            </Modal>
        );
        }
    }
);

class crontabList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            modalTitle: '新建',
            modalType: 'create',
            loading: false,
            pageNo: 1,
            detail: {}
        };
    }

    componentDidMount = () => {
        this.getList();
    }

    // 获取列表
    getList = () => {
        // TODO 请求列表
        axios.get(CRONTAB_LIST_URL, {
        })
        .then((response) => {
            console.log(response.data);
            this.setState({
                list: response.data.data,
                loading: false
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }


    // 新建、编辑modal
    createModal = (row) => {
        console.log('新建row', row)
        this.setState({
            modalTitle: row ? '编辑' : '新建',
            modalType: row ? 'edit' : 'create',
            visible: true,
            detail: row,
        })

        if(row){
            // TODO 详情接口
            this.formRef.props.form.setFieldsValue({
                appName: row.appName,
                title: row.title,
                addressType: row.addressType,
                addressList: row.addressList
            });
        }
    }

    // modal取消事件
    handleCancel = () => {
        const form = this.formRef.props.form;
        form.resetFields();
        this.setState({
            visible: false,
        })
    }
    
    // modal确定事件
    handleCreate = () => {
        console.log('this.formRef', this.formRef)
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
        if (err) {
            return;
        }
        console.log('Received values of form: ', values);
        this.saveGroup(values)
            .then((res)=>{
                const { code, data, msg } = res.data;
                if(code !== 0){
                    message.error(msg);
                    return
                }else{
                    message.success('保存成功');
                    this.setState({ visible: false });
                    form.resetFields();
                    this.getList();
                }
            })
            .catch((err) => {

            })

        });
    }

    // 新增组
    saveGroup = (params) => {
        const { modalType, detail } = this.state;
        const data = new URLSearchParams();
        data.append('appName', params.appName);
        data.append('title', params.title);
        data.append('addressType', params.addressType);
        data.append('addressList', params.addressList === undefined ? null : params.addressList);
        if(modalType === 'edit'){
            data.append('id', detail.id);
        }
        return axios({
            method: 'post',
            url: modalType === 'create' ? CRONTAB_SAVE_URL : CRONTAB_UPDATE_URL,
            headers:{
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data,
        });
    }

    // 删除
    handleDelete = (row) => {
        console.log(row);
        const data = new URLSearchParams();
        data.append('id', row.id);
        axios({
            method: 'post',
            url: CRONTAB_REMOVE_URL,
            headers:{
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data,
        }).then((res) => {
            const { code, data, msg } = res.data;
            if(code !== 0){
                message.error(msg);
            }else{
                message.success('删除成功');
            }
            this.getList();
        })
    }

    saveFormRef = (formRef) => {
        console.log('formRef', formRef)
        this.formRef = formRef;
      }

    render() {

        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '应用名称',
            dataIndex: 'appName',
            key: 'appName',
          }, {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
          }, {
            title: '注册模式',
            key: 'addressType',
            dataIndex: 'addressType',
            render: (text, record) => {
                return (
                    <span>
                        { record.addressType === 1 ? '手动录入' : '自动注册' }
                    </span>
                )
            }
          }, {
            title: '注册地址',
            key: 'addressList',
            dataIndex: 'addressList',
          }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <div>
                    <span>
                        <a href="javascript:;" onClick={() => {this.createModal(record)}} >编辑</a>
                    </span>
                    <Divider type="vertical" />
                    <Popconfirm
                     title="确定要删除吗？" 
                     cancelText="取消"
                     okText="确定"
                     onConfirm={() => {this.handleDelete(record)}}
                     icon={<Icon type="question-circle-o" style={{ color: 'red' }}
                     />}>
                        <a style={{color: 'red'}} href="javascript:;">删除</a>
                    </Popconfirm>
                </div>
            ),
          }];

        const { list, visible, modalTitle, loading } = this.state;
        return (
            <div className="style">
                <BreadcrumbCustom paths={['定时任务', '执行组']}/>
                <div className="content">
                    <Row className="header">
                        <Col span={12}></Col>
                        <Col className="right" span={12}><Button onClick={() => {this.createModal('')}} type="primary">新建</Button></Col>
                    </Row>
                    <Table
                        rowKey='id'
                        columns={columns} 
                        dataSource={list} 
                        pagination={false}
                        loading={loading}
                    />
                </div>

                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    title={modalTitle}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        )
    }
}
const crontabListPage = Form.create()(crontabList);
export default crontabListPage;