import React, { Component } from "react";
import ReactDOM from 'react-dom';
import "./taskStyle.less";

import axios from "axios";
import {
  Table,
  Form,
  Row,
  Col,
  Button,
  Modal,
  Input,
  Divider,
  message,
  Icon,
  Select,
  Popconfirm
} from "antd";
import BreadcrumbCustom from "../common/BreadcrumbCustom";
import { urls } from "../common/Urls";
import moment from "moment";
import { withRouter } from "react-router-dom";

const FormItem = Form.Item;
const Option = Select.Option;

const TASK_LIST_URL = urls("CRONTAB_URL") + "/jobinfo/pageList";
const TASK_ENUM_INFO_URL = urls("CRONTAB_URL") + "/jobinfo/enumInfo";
const TASK_ADD_JAR_URL = urls("CRONTAB_URL") + "/jobinfo/addjar";
const TASK_UPDATE_URL = urls("CRONTAB_URL") + "/jobinfo/update";
const TASK_REMOVE_URL = urls("CRONTAB_URL") + "	/jobinfo/remove";
const TASK_EXECUTE_URL = urls("CRONTAB_URL") + "/jobinfo/trigger";
const TASK_PAUSE_URL = urls("CRONTAB_URL") + "/jobinfo/pause";
const TASK_UPDATE_JAR_URL = urls("CRONTAB_URL") + "/jobinfo/updateJarSource";
const CRONTAB_LIST_URL = urls("CRONTAB_URL") + "/jobgroup";

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const {
        visible,
        onCancel,
        onCreate,
        form,
        title,
        ExecutorBlockStrategyEnum,
        ExecutorFailStrategyEnum,
        ExecutorRouteStrategyEnum,
        GlueTypeEnum,
        groupList,
        modalType
      } = this.props;
      const { getFieldDecorator } = form;
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      };
      return (
        <Modal
          visible={visible}
          title={title}
          okText="保存"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
          className="modal"
        >
          <Form layout="inline">
            <FormItem label="执行组名称" {...formItemLayout}>
              {getFieldDecorator("jobGroup", {
                rules: [
                  {
                    required: true,
                    message: "请选择"
                  }
                ]
              })(
                <Select placeholder="请选择">
                  {groupList.map(item => {
                    return <Option value={item.id}>{item.appName}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label="路由策略" {...formItemLayout}>
              {getFieldDecorator("executorRouteStrategy", {
                rules: [
                  {
                    required: true,
                    message: "请选择"
                  }
                ]
              })(
                <Select placeholder="请选择">
                  {ExecutorRouteStrategyEnum.map(item => {
                    return <Option value={item}>{item}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label="运行模式" {...formItemLayout}>
              {getFieldDecorator("glueType", {
                rules: [
                  {
                    required: true,
                    message: "请选择"
                  }
                ]
              })(
                <Select placeholder="请选择">
                  {GlueTypeEnum.map(item => {
                    return <Option value={item}>{item}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label="执行参数" {...formItemLayout}>
              {getFieldDecorator("executorParam", {
                rules: [
                  {
                    message: "请选择"
                  }
                ]
              })(<Input placeholder="请填写" />)}
            </FormItem>
            <FormItem label="阻塞策略" {...formItemLayout}>
              {getFieldDecorator("executorBlockStrategy", {
                rules: [
                  {
                    required: true,
                    message: "请选择"
                  }
                ]
              })(
                <Select placeholder="请选择">
                  {ExecutorBlockStrategyEnum.map(item => {
                    return <Option value={item}>{item}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label="负责人" {...formItemLayout}>
              {getFieldDecorator("author", {
                rules: [
                  {
                    required: true,
                    message: "请选择"
                  }
                ]
              })(<Input placeholder="请填写" />)}
            </FormItem>
            <FormItem label="任务描述" {...formItemLayout}>
              {getFieldDecorator("jobDesc", {
                rules: [
                  {
                    required: true,
                    message: "请选择"
                  }
                ]
              })(<Input placeholder="请填写" />)}
            </FormItem>
            <FormItem label="Cron表达式" {...formItemLayout}>
              {getFieldDecorator("jobCron", {
                rules: [
                  {
                    required: true,
                    message: "请选择"
                  }
                ]
              })(<Input placeholder="请填写" />)}
            </FormItem>
            <FormItem label="JobHandler" {...formItemLayout}>
              {getFieldDecorator("executorHandler", {
                rules: [
                  {
                    message: "请选择"
                  }
                ]
              })(<Input placeholder="请填写" />)}
            </FormItem>
            <FormItem label="失败处理策略" {...formItemLayout}>
              {getFieldDecorator("executorFailStrategy", {
                rules: [
                  {
                    required: true,
                    message: "请选择"
                  }
                ]
              })(
                <Select placeholder="请选择">
                  {ExecutorFailStrategyEnum.map(item => {
                    return <Option value={item}>{item}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label="报警邮件" {...formItemLayout}>
              {getFieldDecorator("alarmEmail", {
                rules: [
                  {
                    required: true,
                    message: "请填写"
                  }
                ]
              })(<Input placeholder="多个邮件地址逗号分隔" />)}
            </FormItem>

            {modalType === "create" && (
              <div>
                <FormItem {...formItemLayout} label="Jar包" extra="">
                  {getFieldDecorator("file", {
                    getValueFromEvent: this.normFile,
                    rules: [
                      {
                        message: "请选择jar包"
                      }
                    ]
                  })(<input type="file" name="" id="file" />)}
                </FormItem>
                <FormItem label="文件的数据指纹" {...formItemLayout}>
                  {getFieldDecorator("checksum", {
                    rules: [
                      {
                        message: "请填写"
                      }
                    ]
                  })(<Input placeholder="请填写" />)}
                </FormItem>
              </div>
            )}
          </Form>
        </Modal>
      );
    }
  }
);

const UpdateJarForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, title } = this.props;
      const { getFieldDecorator } = form;
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      };
      return (
        <Modal
          visible={visible}
          title={title}
          okText="保存"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
          className="modal"
        >
          <Form layout="inline">
            <div>
              <FormItem {...formItemLayout} label="Jar包" extra="">
                {getFieldDecorator("file2", {
                  getValueFromEvent: this.normFile,
                  rules: [
                    {
                      required: true,
                      message: "请选择jar包"
                    }
                  ]
                })(<input type="file" name="" id="file2" />)}
              </FormItem>
              <FormItem label="文件的数据指纹" {...formItemLayout}>
                {getFieldDecorator("checksum", {
                  rules: [
                    {
                      required: true,
                      message: "请填写"
                    }
                  ]
                })(<Input placeholder="请填写" />)}
              </FormItem>
            </div>
          </Form>
        </Modal>
      );
    }
  }
);

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
      return (
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="执行组ID">
                {getFieldDecorator("jobGroup")(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="任务描述">
                {getFieldDecorator("jobDesc")(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="handle">
                {getFieldDecorator("executorHandler")(
                  <Input placeholder="请输入" />
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

class taskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      modalTitle: "新建",
      modalType: "create",
      pageNo: 1,
      ExecutorBlockStrategyEnum: [],
      ExecutorFailStrategyEnum: [],
      ExecutorRouteStrategyEnum: [],
      GlueTypeEnum: [],
      groupList: [],
      updateJarModalVisible: false,
      updateJarDetail: {}
    };
  }

  componentDidMount = () => {
    this.getEnumInfo();
    this.getGroup();
    this.getList();
  };

  // 获取列表
  getList = () => {
    const { pageNo, jobGroup, jobDesc, executorHandler } = this.state;
    axios
      .get(TASK_LIST_URL, {
        params: {
          pageNo: pageNo,
          pageSize: 20,
          jobGroup,
          jobDesc,
          executorHandler
        }
      })
      .then(res => {
        const { code, data, msg } = res.data;
        console.log("list", data);
        if (code !== 0) {
          message.error(msg);
          return;
        }
        this.setState({
          list: data.data,
          recordsTotal: data.recordsTotal
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleSearch = values => {
    this.setState(
      {
        jobGroup: values.jobGroup,
        jobDesc: values.jobDesc,
        executorHandler: values.executorHandler
      },
      () => {
        this.getList();
      }
    );
  };

  // 任务枚举信息
  getEnumInfo = () => {
    // const {  } = this.state;
    axios
      .get(TASK_ENUM_INFO_URL, {})
      .then(res => {
        console.log(res.data);
        const { data } = res.data;
        this.setState({
          ExecutorBlockStrategyEnum: data.ExecutorBlockStrategyEnum || [],
          ExecutorFailStrategyEnum: data.ExecutorFailStrategyEnum || [],
          ExecutorRouteStrategyEnum: data.ExecutorRouteStrategyEnum || [],
          GlueTypeEnum: data.GlueTypeEnum || []
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  // 获取组
  getGroup = () => {
    // TODO 请求列表
    axios
      .get(CRONTAB_LIST_URL, {})
      .then(res => {
        console.log(res.data);
        const { code, data, msg } = res.data;
        if (code !== 0) {
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

  createModal = record => {
    console.log("新建record", record);
    this.setState({
      modalTitle: record ? "编辑" : "新建",
      modalType: record ? "edit" : "create",
      modalDetail: record,
      visible: true
    });

    if (record) {
      // TODO 详情接口
      this.formRef.props.form.setFieldsValue({
        jobGroup: record.jobGroup,
        executorRouteStrategy: record.executorRouteStrategy,
        glueType: record.glueType,
        executorParam: record.executorParam,
        executorBlockStrategy: record.executorBlockStrategy,
        author: record.author,
        jobDesc: record.jobDesc,
        jobCron: record.jobCron,
        executorHandler: record.executorHandler,
        executorFailStrategy: record.executorFailStrategy,
        alarmEmail: record.alarmEmail
      });
    }
  };

  handleCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields();
    this.setState({
      visible: false
    });
  };

  handleCreate = () => {
    const { modalDetail, modalType } = this.state;
    console.log("this.formRef", this.formRef);
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (modalType === "edit") {
        delete err["file"];
        delete err["checksum"];
        delete values["file"];
        delete values["checksum"];
        console.log("err当前值：", JSON.stringify(err));
        console.log("err当前值：", JSON.stringify(err) === "{}");
        if (JSON.stringify(err) === "{}") {
          err = null;
        }
        console.log("err当前值：", err);
      }

      if (err) {
        console.log("err", err);
        return;
      }

      const formData = new FormData();
      if (modalType === "create") {
        formData.append("file", document.getElementById("file").files[0]);
      }
      if (modalType === "edit") {
        formData.append("id", modalDetail.id);
      }

      for (let item in values) {
        if(values[item] === undefined){
            formData.append(item, null);
        }else {
            formData.append(item, values[item]);
        }
      }

      axios({
        method: "post",
        url: modalType === "edit" ? TASK_UPDATE_URL : TASK_ADD_JAR_URL,
        headers: {
          "Content-type": "multipart/form-data"
        },
        data: formData
      })
        .then(res => {
          const { code, data, msg } = res.data;
          if (code !== 0) {
            message.error(msg);
            return;
          }
          form.resetFields();
          this.setState({ visible: false });
          this.getList();
        })
        .catch(err => {
          console.log(err);
        });

      console.log("Received values of form: ", values);
      // TODO 保存接口

      //   form.resetFields();
      //   this.setState({ visible: false });
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

  //删除
  handleDelete = row => {
    const data = new URLSearchParams();
    data.append("id", row.id);
    axios({
      method: "post",
      url: TASK_REMOVE_URL,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      data
    }).then(res => {
      const { code, data, msg } = res.data;
      if (code !== 0) {
        message.error(msg);
      } else {
        message.success("删除成功");
      }
      this.getList();
    });
  };

  //执行
  handleExecute = row => {
    const data = new URLSearchParams();
    data.append("id", row.id);
    axios({
      method: "post",
      url: TASK_EXECUTE_URL,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      data
    }).then(res => {
      const { code, data, msg } = res.data;
      if (code !== 0) {
        message.error(msg);
      } else {
        message.success("执行成功");
      }
      this.getList();
    });
  };
  //暂停
  handlePause = row => {
    const data = new URLSearchParams();
    data.append("id", row.id);
    axios({
      method: "post",
      url: TASK_PAUSE_URL,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      data
    }).then(res => {
      const { code, data, msg } = res.data;
      if (code !== 0) {
        message.error(msg);
      } else {
        message.success("暂停成功");
      }
      this.getList();
    });
  };

  // 新建modal ref
  saveFormRef = formRef => {
    console.log("formRef", formRef);
    this.formRef = formRef;
  };

  // 更新jar modal ref
  saveUpdateJarFormRef = formRef => {
    this.updateJarFormRef = formRef;
  };

  //   更新jar
  handleUpdateJar = row => {
    this.setState({
      updateJarModalVisible: true,
      updateJarDetail: row
    });

    // const form = this.updateJarFormRef.props.form;
    // form.validateFields((err, values) => {})
  };

  //   更新jar确定
  handleUpdateJarOk = () => {
    const { updateJarDetail } = this.state;
    const form = this.updateJarFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        console.log("err", err);
        return;
      }

      const formData = new FormData();
      formData.append("file", document.getElementById("file2").files[0]);
      formData.append("checksum", values.checksum);
      formData.append("jobId", updateJarDetail.id);

      axios({
        method: "post",
        url: TASK_UPDATE_JAR_URL,
        headers: {
          "Content-type": "multipart/form-data"
        },
        data: formData
      })
        .then(res => {
          const { code, data, msg } = res.data;
          if (code !== 0) {
            message.error(msg);
            return;
          }
          message.info("更新成功");
          form.resetFields();
          this.setState({ updateJarModalVisible: false });
          this.getList();
        })
        .catch(err => {
          console.log(err);
        });

      console.log("Received values of form: ", values);
    });
  };

  //  更新jar取消
  handleUpdateJarCancel = () => {
    const form = this.updateJarFormRef.props.form;
    form.resetFields();
    this.setState({
      updateJarModalVisible: false
    });
  };

  //   log
  log = row => {
    this.props.history.push(`/app/crontab/log/${row.id}`);
  };


  render() {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "描述",
        dataIndex: "jobDesc",
        key: "jobDesc"
      },
      {
        title: "运行模式",
        dataIndex: "glueType",
        key: "glueType"
      },
      {
        title: "cron表达式",
        key: "jobCron",
        dataIndex: "jobCron"
      },
      {
        title: "负责人",
        key: "author",
        dataIndex: "author"
      },
      {
        title: "状态",
        key: "jobStatus",
        dataIndex: "jobStatus"
      },
      {
        title: "操作",
        key: "action",
        render: (text, record) => (
          <span>
            <Popconfirm
              title="确定要执行吗？"
              cancelText="取消"
              okText="确定"
              onConfirm={() => {
                this.handleExecute(record);
              }}
              icon={<Icon type="question-circle-o" />}
            >
              <a href="javascript:;">执行</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要暂停吗？"
              cancelText="取消"
              okText="确定"
              onConfirm={() => {
                this.handlePause(record);
              }}
              icon={<Icon type="question-circle-o" />}
            >
              <a href="javascript:;">暂停</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a
              href="javascript:;"
              onClick={() => {
                this.log(record);
              }}
            >
              日志
            </a>
            <Divider type="vertical" />
            <a
              href="javascript:;"
              onClick={() => {
                this.createModal(record);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              href="javascript:;"
              onClick={() => {
                this.handleUpdateJar(record);
              }}
            >
              更新Jar
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除吗？"
              cancelText="取消"
              okText="确定"
              onConfirm={() => {
                this.handleDelete(record);
              }}
              icon={<Icon type="question-circle-o" style={{ color: "red" }} />}
            >
              <a style={{ color: "red" }} href="javascript:;">
                删除
              </a>
            </Popconfirm>
          </span>
        )
      }
    ];

    const {
      list,
      visible,
      modalTitle,
      recordsTotal,
      ExecutorBlockStrategyEnum,
      ExecutorFailStrategyEnum,
      ExecutorRouteStrategyEnum,
      GlueTypeEnum,
      groupList,
      modalType,
      updateJarModalVisible,
    } = this.state;
    return (
      <div className="style">
        <BreadcrumbCustom paths={["定时任务", "任务列表"]} />
        <div className="content">
          <WrappedAdvancedSearchForm handleSearch={this.handleSearch} />
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
        </div>

        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          title={modalTitle}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          ExecutorBlockStrategyEnum={ExecutorBlockStrategyEnum}
          ExecutorFailStrategyEnum={ExecutorFailStrategyEnum}
          ExecutorRouteStrategyEnum={ExecutorRouteStrategyEnum}
          GlueTypeEnum={GlueTypeEnum}
          groupList={groupList}
          modalType={modalType}
        />

        <UpdateJarForm
          wrappedComponentRef={this.saveUpdateJarFormRef}
          visible={updateJarModalVisible}
          title="更新jar"
          onCancel={this.handleUpdateJarCancel}
          onCreate={this.handleUpdateJarOk}
        />
      </div>
    );
  }
}
const taskListPage = Form.create()(taskList);
export default taskListPage;
