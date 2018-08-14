import React, {Component} from 'react';
import './form.less';

import axios from 'axios';
import Mock from 'mockjs';
import moment from 'moment';
import {Row, Col, Input, Icon, Cascader, DatePicker, Button, Tooltip, Popconfirm, notification} from 'antd';

import BreadcrumbCustom from '../common/BreadcrumbCustom';
import address from './request/address.json';
import data from './request/data.json';
import CollectionCreateForm from './CustomizedForm';
import FormTable from './FormTable';
import {NotificationPlacement} from "antd/lib/notification/index";


const Search = Input.Search;
const InputGroup = Input.Group;
const options = [];
const {RangePicker} = DatePicker;
Mock.mock('/address', address);
Mock.mock('/data', data);

var MSGTEMPLATE_URL = "http://api.msg.inner.72solo.com/msgTemplate";
// var MSGTEMPLATE_URL = "http://172.16.23.207:7070/msgTemplate";

//数组中是否包含某项
function isContains(arr, item) {
    arr.map(function (ar) {
        if (ar === item) {
            return true;
        }
    });
    return false;
}

//找到对应元素的索引
function catchIndex(arr, key) { //获取INDEX
    arr.map(function (ar, index) {
        if (ar.key === key) {
            return index;
        }
    });
    return 0;
}

//替换数组的对应项
function replace(arr, item, place) { //arr 数组,item 数组其中一项, place 替换项
    arr.map(function (ar) {
        if (ar.key === item) {
            arr.splice(arr.indexOf(ar), 1, place)
        }
    });
    return arr;
}

export default class UForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            address: '',
            timeRange: '',
            visible: false, //新建窗口隐藏
            dataSource: [],
            count: data.length,
            selectedRowKeys: [],
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            pageNo: 0,
            pageSize:10
        };
    }

    //getData
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

    //用户名输入
    onChangeUserName = (e) => {
        const value = e.target.value;
        this.setState({
            userName: value,
        })
    };
    //用户名搜索
    onSearchUserName = (value) => {
        // console.log(value);
        const {dataSource} = this.state;
        this.setState({
            dataSource: dataSource.filter(item => item.name.indexOf(value) !== -1),
            loading: false,
        })
    };
    //地址级联选择
    Cascader_Select = (value) => {
        const {dataSource} = this.state;
        if (value.length === 0) {
            this.setState({
                address: value,
                dataSource: [],
            });
            this.getData();
        } else {
            this.setState({
                address: value,
                dataSource: dataSource.filter(item => item.address === value.join(' / '))
            });
        }
    };
    //时间选择
    RangePicker_Select = (date, dateString) => {
        // console.log(date, dateString);
        const {dataSource} = this.state;
        const startime = moment(dateString[0]);
        const endtime = moment(dateString[1]);
        if (date.length === 0) {
            this.setState({
                timeRange: date,
                dataSource: [],
            });
            this.getData();
        } else {
            this.setState({
                timeRange: date,
                dataSource: dataSource.filter(item => (moment(item.createtime.substring(0, 10)) <= endtime && moment(item.createtime.substring(0, 10)) >= startime) === true)
            });
        }
    };

    //渲染
    componentDidMount() {
        axios.get('/address')
            .then(function (response) {
                response.data.map(function (province) {
                    options.push({
                        value: province.name,
                        label: province.name,
                        children: province.city.map(function (city) {
                            return {
                                value: city.name,
                                label: city.name,
                                children: city.area.map(function (area) {
                                    return {
                                        value: area,
                                        label: area,
                                    }
                                })
                            }
                        }),
                    })
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        this.getData();
    }

    //搜索按钮
    btnSearch_Click = () => {

    };
    //重置按钮
    btnClear_Click = () => {
        this.setState({
            userName: '',
            address: '',
            timeRange: '',
            dataSource: [],
            count: data.length,
        });
        this.getData();
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
        const {dataSource, count} = this.state;
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

    //批量删除
    MinusClick = () => {
        const {dataSource, selectedRowKeys} = this.state;
        this.setState({
            dataSource: dataSource.filter(item => !isContains(selectedRowKeys, item.key)),
        });
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
        console.log(current);
        this.setState({
            pageNo: current-1,
            pageSize: pageSize,
        }, () => {
            this.getData();
        });
    };

    render() {
        const {userName, address, timeRange, dataSource, visible, isUpdate, loading} = this.state;
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
                    <FormTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        onDelete={this.onDelete}
                        editClick={this.editClick}
                        loading={loading}
                        pageChange={this.pageChange}
                    />
                    {isUpdate ?
                        <CollectionCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                                              onCreate={this.handleUpdate} title="修改" okText="更新"
                        /> : <CollectionCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                                                   onCreate={this.handleCreate} title="新建" okText="创建"
                        />}
                </div>
            </div>
        )
    }
}