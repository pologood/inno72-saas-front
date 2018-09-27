import React, {PureComponent} from 'react';
import {Row, Col, Input, Switch, Button, Form, Select, DatePicker, Table} from 'antd';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import "./Activelog.less"
import axios from 'axios';
import {urls} from "../../common/Urls";
import moment from 'moment';

const LOGINFO_URL = urls('ACTIVE_URL') + '/log/LogInfo';

class ActivelogQuery extends PureComponent{

    constructor(props) {
        super(props);

        this.state = {loading:false,
            dataSource:[],
            currentPage:1,
            autoSwith:false};

        this.autoSwithTo = null;

    }

    handleSearch(e){

        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;

            let info = {
                instanceName:fieldsValue.instanceName? fieldsValue.instanceName :null,
                appName:fieldsValue.appName? fieldsValue.appName :null,
                level:fieldsValue.level? fieldsValue.level :null,
                startTime: fieldsValue.startTime? fieldsValue.startTime.format('YYYY-MM-DD HH:mm:ss') :null,
                endTime: fieldsValue.endTime? fieldsValue.endTime.format('YYYY-MM-DD HH:mm:ss') :null,
                detail: fieldsValue.detail? fieldsValue.detail :null,
                pageNo:0,
                pageSzie:20,
            };

            this.queryInfo(info);

        });

    }

    queryInfo(info){
        this.setState({
            loading:true,
        });
        axios.post(LOGINFO_URL, info).then(res => {
            console.log(res);
            if(res && res.status===200 && res.data && res.data.code === 0){
                this.setState({
                    dataSource:res.data.data,
                    currentPage:info.pageNo + 1,
                });
            }
        }).catch( err => {
            console.error(err);
        }).finally(() => {
            this.setState({
                loading:false,
            });
        })
    }


    onChangePage(page){

        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;

            let info = {
                instanceName:fieldsValue.instanceName? fieldsValue.instanceName :null,
                appName:fieldsValue.appName? fieldsValue.appName :null,
                level:fieldsValue.level? fieldsValue.level :null,
                startTime: fieldsValue.startTime? fieldsValue.startTime.format('YYYY-MM-DD HH:mm:ss') :null,
                endTime: fieldsValue.endTime? fieldsValue.endTime.format('YYYY-MM-DD HH:mm:ss') :null,
                detail: fieldsValue.detail? fieldsValue.detail :null,
                pageNo:page - 1,
                pageSzie:20,
            };

            this.queryInfo(info);

        });

    }

    onChangeAuto(checked){

        if(checked){
            if(this.autoSwithTo)
                clearInterval(this.autoSwithTo);

            this.autoSwithTo = setInterval(() => {
                this.onChangePage(1);
            }, 2000)

        }else{
            clearInterval(this.autoSwithTo);
        }

        this.setState({
            autoSwith:checked
        })
    }


    renderTable(){

        const columns = [{
            title: 'App名称',
            dataIndex: '_source.appName',
            align:'centor',
            width:'150px',
        },{
            title: '日志等级',
            dataIndex: '_source.level',
            align:'centor',
            width:'100px',
        },{
            title: '时间',
            dataIndex: '_source.time',
            align:'centor',
            width:'100px',
        },{
            title: '内容',
            dataIndex: '_source.detail',
            render: (text, record) => {
                if(record && record.highlight && record.highlight.detail)
                    return <span dangerouslySetInnerHTML={{__html: record.highlight.detail}}/>
                return <span>{text}</span>
            }
        }];

        let pagination = false;
        if(this.state.dataSource.length > 0 && !this.state.autoSwith){
            pagination = {
                total: 5000,
                pageSize: this.state.dataSource? this.state.dataSource.length:0,
                onChange:this.onChangePage.bind(this),
                current:this.state.currentPage,
            }
        }

        return(
            <Table columns={columns}
                   dataSource={this.state.dataSource}
                   bordered={true}
                   className='formTable'
                   scroll={{x:'100%'}}
                   loading={this.state.loading}
                   rowKey={record => record._id}
                   pagination={pagination}
                   />);

    }


    render(){
        const { form } = this.props;
        const { getFieldDecorator } = form;

        let appNames = ['machineAppBackend', 'a1', 'a2'];
        let logLevels = ['info', 'debug', 'error', 'warn'];

        return (
            <div>
                <BreadcrumbCustom paths={['日志动态查询', '日志动态查询']}/>
                <div className='formBody'>
                    <Form onSubmit={this.handleSearch.bind(this)}>
                        <Row gutter={16}>

                            <Col className="gutter-row" sm={4}>
                                <Form.Item>
                                    {getFieldDecorator('instanceName')(<Input disabled={this.state.autoSwith} placeholder="实例名称" />)}
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" sm={4}>
                                <Form.Item>
                                    {getFieldDecorator('appName')(
                                        <Select mode="tags" disabled={this.state.autoSwith} tokenSeparators={[',']} placeholder="请选App名称">
                                            {appNames.map((item) => {
                                                return (
                                                    <Select.Option key={item} value={item} >{item}</Select.Option>
                                                );
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" sm={3}>
                                <Form.Item >
                                    {getFieldDecorator('level')(
                                        <Select mode="tags" disabled={this.state.autoSwith} tokenSeparators={[',']} placeholder="请选择日志等级" >
                                            {logLevels.map((item) => {
                                                return (
                                                    <Select.Option key={item} value={item} >{item}</Select.Option>
                                                );
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" sm={4}>
                                <Form.Item >
                                    {getFieldDecorator('startTime')(
                                        <DatePicker disabled={this.state.autoSwith}
                                                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="开始时间"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" sm={4}>
                                <Form.Item>
                                    {getFieldDecorator('endTime')(
                                        <DatePicker disabled={this.state.autoSwith}
                                                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="结束时间"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" sm={4}>
                                <Form.Item>
                                    {getFieldDecorator('detail')(<Input disabled={this.state.autoSwith} placeholder="查询关键字" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Switch onChange={this.onChangeAuto.bind(this)} style={{marginLeft: '10px'}} checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.autoSwith} />

                            <div className='btnOpera'>
                                <Button type="primary" htmlType="submit" disabled={this.state.autoSwith}
                                        style={{marginRight: '50px'}}>查询</Button>
                            </div>
                        </Row>
                    </Form>
                    {this.renderTable()}
                </div>
            </div>
                )
    }

}


const ActivelogQueryExport = Form.create()(ActivelogQuery);
export default ActivelogQueryExport;