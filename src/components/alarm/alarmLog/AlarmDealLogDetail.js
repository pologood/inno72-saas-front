import React, {Component} from 'react';
import {Button, Modal, Form, Input, Radio, TimePicker, Select, Row, Col} from 'antd';
import moment from 'moment';
import './AlarmLog.less';

import AlarmDetailLogTable from './AlarmDetailLogTable'

import {urls} from "../../common/Urls";
import {notifySuccess, notifyError} from '../../common/Common';
import axios from "axios/index";

const ALARM_DEAL_LOG_URL = urls('ALARM_URL') + '/alarm/deal/log';
const ALARM_DETAIL_LOG_URL = urls('ALARM_URL') + '/alarm/detail/log';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const {TextArea} = Input;

class AlarmDealLogDetail extends Component {
    state = {
        arrInput: {},
        dataSource: [],
        loading: true,
        dealLogId : '',
        dealUser : '',
        dealMethod : '',
        page : 1,
        size : 10
    };

    //渲染
    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        const {alarmDealLog} = nextProps;
        if (alarmDealLog) {
            this.setState({
                dealLogId : alarmDealLog.id
            });
            this.getData(alarmDealLog.id);
        }
    }

    constructor(props) {
        super(props);
    }

    handleOnClick = () => {
        if (this.state.dealUser.trim() == '') {
            notifyError('请填写解决人');
            return;
        }
        if (this.state.dealMethod.trim() == '') {
            notifyError('请填写解决方法');
            return;
        }

        axios.post(ALARM_DEAL_LOG_URL + '/save', {
            id: this.state.dealLogId,
            dealUser : this.state.dealUser,
            dealMethod : this.state.dealMethod,
            status : '1'
        })
        .then((response) => {
            if (response.data.code == 0) {
                notifySuccess();
                this.props.handleAndRefresh();
            } else {
                notifyError();
            }
        })
        .catch(function (error) {
            notifyError();
        });
    };

    onChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        if (name == 'dealUser') {
            this.setState({
                dealUser : value
            })
        }
        if (name == 'dealMethod') {
            this.setState({
                dealMethod : value
            })
        }
    };

    //分页
    pageChange = (current, pageSize) => {
        this.setState({
            page: current,
            size: pageSize,
        }, () => {
            this.getData();
        });
    };

    getData = (id) => {
        axios.get(ALARM_DETAIL_LOG_URL + '/list', {
            params: {
                page: this.state.page,
                size: this.state.size,
                logId: id
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

    render() {
        const {visible, onCancel, title, alarmDealLog} = this.props;
        const {dataSource, loading} = this.state;
        return (
            <Modal
                width={800}
                visible={visible}
                title={title}
                onCancel={onCancel}
            >
                <div>
                    <Row>
                        <Col span={4}>所属应用</Col>
                        <Col span={20}>{alarmDealLog.appName}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>报警规则名称</Col>
                        <Col span={20}>{alarmDealLog.alarmRule ? alarmDealLog.alarmRule.appName : ''}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>报警时间</Col>
                        <Col span={20}>{alarmDealLog.createTime}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>负责人</Col>
                        <Col span={20}>{alarmDealLog.alarmRule ? alarmDealLog.alarmRule.director : ''}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>第一次查看时间</Col>
                        <Col span={20}>{alarmDealLog.firstReadTime}</Col>
                    </Row>

                    <Row>
                        <Col span={4}>状态</Col>
                        <Col span={20}>{alarmDealLog.status == 1 ? '已处理' : '未处理'}</Col>
                    </Row>

                    {alarmDealLog.status == 1
                        ?  <Row>
                            <Col span={4}>解决时间</Col>
                            <Col span={20}>{alarmDealLog.dealTime}</Col>
                        </Row>
                        :  null
                    }

                    <Row style={{marginTop: '10px'}}>
                        <Col span={4}>解决人</Col>
                        <Col span={20}>
                            {alarmDealLog.status == 1
                                ?  alarmDealLog.dealUser
                                :  <Col span={20}><Input name="dealUser" value={this.state.dealUser} onChange={this.onChange} style={{width: '100px'}}/> </Col>
                            }
                        </Col>
                    </Row>

                    <Row style={{marginTop: '10px'}}>
                        <Col span={4}>解决方式</Col>
                        {alarmDealLog.status == 1
                            ?  alarmDealLog.dealMethod
                            :  <Col span={20}><Input name="dealMethod" onChange={this.onChange} value={this.state.dealMethod}/>
                                <Button onClick={this.handleOnClick} type="primary" style={{float: 'right',marginBottom: '10px',marginTop: '10px'}}>提交</Button></Col>
                        }
                    </Row>

                    <AlarmDetailLogTable
                        dataSource={dataSource}
                        detailClick={this.detailClick}
                        loading={loading}
                        pageChange={this.pageChange}
                    />
                </div>
            </Modal>
        );
    }
}

export default AlarmDealLogDetail;