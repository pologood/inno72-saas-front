import React, { Component } from "react";
import "./logStyle.less";

import axios from "axios";
import {
  Table,
  Form,
  Tag,
  Row,
  Col,
  Button,
  Modal,
  Input,
  Radio,
  Divider,
  message,
  Select,
  Tooltip
} from "antd";
import BreadcrumbCustom from "../common/BreadcrumbCustom";
import { urls } from "../common/Urls";
import moment from "moment";

const FormItem = Form.Item;
const Option = Select.Option;

const LOG_LIST_URL = urls("CRONTAB_URL") + "/joblog/pageList";
const LOG_DETAIL_CAT_URL = urls("CRONTAB_URL") + "/joblog/logDetailCat";
const CRONTAB_LIST_URL = urls("CRONTAB_URL") + "/jobgroup";

let logTimer = null;

const WrappedAdvancedSearchForm = Form.create()(
  class AdvancedSearchForm extends React.Component {
    state = {
      expand: false
    };

    handleSearch = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        // console.log('Received values of form: ', values);
        this.props.handleSearch(values);
      });
    };

    handleReset = () => {
      this.props.form.resetFields();
    };

    render() {
      const { getFieldDecorator } = this.props.form;
      const { groupList } = this.props;
      return (
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="执行组ID">
                {getFieldDecorator("jobGroup", {initialValue: ""})(
                  <Select placeholder="请选择">
                    <Option value="">全部</Option>
                    {groupList.map(item => {
                      return <Option value={item.id}>{item.appName}</Option>;
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="任务ID">
                {getFieldDecorator("jobId")(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="日志状态">
                {getFieldDecorator("executorHandler", {initialValue: 0})(
                  <Select placeholder="请选择">
                    <Option value={0}>全部</Option>
                    <Option value={1}>成功</Option>
                    <Option value={2}>失败</Option>
                </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                清除
              </Button>
            </Col>
          </Row>
        </Form>
      );
    }
  }
);

class crontabList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      recordsTotal: 0,
      pageNo: 1,
      groupList: [],
      logList: [],
      detail: {}
    };
  }

  componentDidMount = () => {
    this.getGroupList();
    const jobId = this.props.match.params.id;
    if (jobId) {
      this.formRef.props.form.setFieldsValue({
        jobId
      });

      this.handleSearch({ jobId, jobGroup: "", logStatus: "" });
    } else {
      this.getList();
    }
    // this.getList();
    // this.handleSearch();
  };

  getList = () => {
    // TODO 请求列表
    const { pageNo, jobGroup, jobId, logStatus } = this.state;
    axios
      .get(LOG_LIST_URL, {
        params: {
          pageNo: pageNo,
          pageSize: 20,
          jobGroup,
          jobId,
          logStatus
        }
      })
      .then(res => {
        const { code, data, msg } = res.data;
        console.log(data);
        if (code !== 0) {
          message.error(msg);
          return;
        }
        this.setState({
          list: data.data,
          recordsTotal: data.recordsTotal
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  //   搜索
  handleSearch = values => {
    this.setState(
      {
        jobGroup: values.jobGroup,
        jobId: values.jobId,
        logStatus: values.logStatus
      },
      () => {
        console.log("handleSearch", values);
        this.getList();
      }
    );
  };

  getGroupList = () => {
    // TODO 请求列表
    axios
      .get(CRONTAB_LIST_URL, {})
      .then(res => {
        const { code, data, msg } = res.data;
        if (code !== 0) {
          message.error(msg);
          return;
        }
        this.setState({
          groupList: data
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  //分页
  handlePageChange = selectedRowKeys => {
    console.log(selectedRowKeys);
    this.setState(
      {
        pageNo: selectedRowKeys.current
      },
      () => {
        this.getList();
      }
    );
  };

  handleOk = () => {
    clearTimeout(logTimer);
    this.setState({
      visible: false
    });
  };

  //   时时日志
  createModal = row => {
    this.setState(
      {
        visible: true,
        detail: row,
      },
      () => {
        this.getLogList(row);
      }
    );
  };

  //   获取logList
  getLogList = row => {
    axios
      .get(LOG_DETAIL_CAT_URL, {
        params: {
          executorAddress: row.executorAddress,
          triggerTime: row.triggerTime,
          logId: row.id,
          fromLineNum: 1
        }
      })
      .then(res => {
        const { code, data, msg } = res.data;
        if (code !== 0) {
          message.error(msg);
          return;
        }
        this.setState({
            logList: [data.logContent]
        })
        
        // this.setState({
        //   logList: [...this.state.logList, data.logContent]
        // }, () => {
        //     if(data.end){
        //         return;
        //     }
        //     logTimer = setTimeout(() => {
        //         row.fromLineNum = data.toLineNum + 1
        //         this.getLogList(row)
        //     }, 2000)
        // });
      })
      .catch(error => {
        console.log(error);
      });
  };

  saveFormRef = formRef => {
    console.log("formRef", formRef);
    this.formRef = formRef;
  };

  refresh = () => {
    this.getLogList(this.state.detail);
  }

  render() {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "调度时间",
        dataIndex: "triggerTime",
        key: "triggerTime",
        render: (text, record) => {
          const date = new Date(record.triggerTime);
          const y = date.getFullYear();
          const m = date.getMonth();
          const d = date.getDate();
          const h = date.getHours();
          const mm = date.getMinutes();
          const s = date.getSeconds();
          return <span>{`${y}-${m + 1}-${d} ${h}:${mm}:${s}`}</span>;
        }
      },
      {
        title: "调度结果",
        dataIndex: "triggerCode",
        key: "triggerCode",
        render: (text, record) => {
          return <span>{record.triggerCode === 0 ? "成功" : "失败"}</span>;
        }
      },
      {
        title: "调度日志",
        dataIndex: "triggerMsg",
        key: "triggerMsg",
        width: 100,
        render: (text, record) => {
            return <Tooltip placement="right" title={<span dangerouslySetInnerHTML={{__html: text}}></span>   } arrowPointAtCenter>
            <a href="javascript:;">查看</a>
          </Tooltip>
        }
      },
      {
        title: "执行器地址",
        key: "executorAddress",
        dataIndex: "executorAddress"
      },
      {
        title: "运行模式",
        key: "glueType",
        dataIndex: "glueType"
      },
      {
        title: "任务参数",
        key: "executorParam",
        dataIndex: "executorParam"
      },
      {
        title: "执行结果",
        key: "handleCode",
        dataIndex: "handleCode",
        render: (text, record) => {
          if (record.handleCode === 0) {
            return <span>成功</span>;
          } else if (record.handleCode === 1000) {
            return <span>执行中</span>;
          }
          return <span />;
        }
      },
      {
        title: "操作",
        key: "action",
        render: (text, record) => (
          <span>
            <a
              href="javascript:;"
              onClick={() => {
                this.createModal(record);
              }}
            >
              查看
            </a>
          </span>
        )
      }
    ];

    const { list, visible, modalTitle, recordsTotal, groupList, logList } = this.state;
    return (
      <div className="style">
        <BreadcrumbCustom paths={["定时任务", "日志"]} />
        <div className="content">
          <WrappedAdvancedSearchForm
            wrappedComponentRef={this.saveFormRef}
            handleSearch={this.handleSearch}
            groupList={groupList}
          />
          <Row className="header">
            <Col span={12} />
            <Col className="right" span={12}>
              <Button
                onClick={() => {
                  this.createModal("");
                }}
                type="primary"
              >
                新建
              </Button>
            </Col>
          </Row>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={list}
            pagination={{ pageSize: 20, total: recordsTotal }}
            onChange={this.handlePageChange}
          />
          <Modal
            title="时时日志"
            cancelText="刷新"
            maskClosable={false}
            destroyOnClose={true}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.refresh}
            className="logModal"
          >
          <div>
              
              {logList.map((item) => {
                  return <p dangerouslySetInnerHTML={{__html: item}} ></p>
              })}
          </div>
          </Modal>
        </div>
      </div>
    );
  }
}
const crontabListPage = Form.create()(crontabList);
export default crontabListPage;
