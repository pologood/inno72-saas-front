import React, {Component} from 'react';
import {Button, Modal, Form, Input, Radio, TimePicker, Select, Row, Col} from 'antd';
import moment from 'moment';
import './AlarmLog.less';

import AlarmDetailLogTable from './AlarmDetailLogTable'

import {urls} from "../../common/Urls";
import axios from "axios/index";

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
    };

    //渲染
    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        const {alarmDealLog} = nextProps;
        if (alarmDealLog) {
            this.getData(alarmDealLog.id);
        }
    }

    constructor(props) {
        super(props);
    }

    getData = (id) => {
        axios.get(ALARM_DETAIL_LOG_URL + '/getList?logId='+ id)
        .then(function (response) {
            console.log(response.data);
            this.setState({
                dataSource: response.data,
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
                        <Col span={4}>解决时间</Col>
                        <Col span={20}>{alarmDealLog.dealTime}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>解决人</Col>
                        <Col span={20}>{alarmDealLog.dealUser}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>状态</Col>
                        <Col span={20}>{alarmDealLog.status == 1 ? '已处理' : '未处理'}</Col>
                    </Row>
                    <Row>
                        <Col span={4}>解决方式</Col>
                        <Col span={20}>{alarmDealLog.appName}</Col>
                    </Row>

                    <AlarmDetailLogTable
                        dataSource={dataSource}
                        detailClick={this.detailClick}
                        loading={loading}
                    />


                </div>
            </Modal>
        );
    }
}

export default AlarmDealLogDetail;