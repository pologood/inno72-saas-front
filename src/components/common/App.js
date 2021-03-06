import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';
import '../../style/index.less';

import SiderCustom from './SiderCustom';
import HeaderCustom from './HeaderCustom';
import MIndex from '../index/Index';
import Calendars from '../header/Calendars';
import Echarts from '../chart/echarts/Echarts';
import UForm from '../form/Form';
import noMatch from './404';
import RichText from "../richText/RichText";
import UploadEditor from "../upload/UploadEditor";
import MessageTemplate from "../message/messageTemplate/MessageTemplate";
import MessageHistory from "../message/messageHistory/MessageHistory";
import AlarmNotifyType from "../alarm/alarmNotifyType/AlarmNotifyType";
import AlarmUser from "../alarm/alarmUser/AlarmUser";
import AlarmRule from "../alarm/alarmRule/AlarmRule";
import AlarmDealLog from "../alarm/alarmLog/AlarmDealLog";
import ActivelogQuery from "../activelog/activelogQuery/ActivelogQuery";
import crontabListPage from "../crontab/list";
import taskListPage from "../crontab/task";
import logListPage from "../crontab/log";

const {Content, Footer} = Layout;

export default class App extends Component {
    state = {
        collapsed: localStorage.getItem("mspa_SiderCollapsed") === "true",
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        }, function () {
            localStorage.setItem("mspa_SiderCollapsed", this.state.collapsed);
        });
    };

    componentDidMount() {
        //保存Sider收缩
        if (localStorage.getItem("mspa_SiderCollapsed") === null) {
            localStorage.setItem("mspa_SiderCollapsed", false);
        }
    }

    render() {
        const {collapsed} = this.state;
        const {location} = this.props;
        let name;
        if (localStorage.getItem("mspa_user") === null) {
            return <Redirect to="/login"/>
        } else {
            name = location.state === undefined ? JSON.parse(localStorage.getItem("mspa_user")).username : location.state.username;
        }

        return (
            <Layout className="ant-layout-has-sider" style={{height: '100%'}}>
                <SiderCustom collapsed={collapsed} path={location.pathname}/>
                <Layout>
                    <HeaderCustom collapsed={collapsed} toggle={this.toggle} username={name}/>
                    <Content style={{margin: '0 16px'}}>
                        <Switch>
                            <Route exact path={'/app'} component={MIndex} />
                            <Route exact path={'/app/form'} component={UForm} />
                            <Route exact path={'/app/header/Calendars'} component={Calendars} />
                            <Route exact path={'/app/chart/echarts'} component={Echarts} />
                            <Route exact path={'/app/richText'} component={RichText} />
                            <Route exact path={'/app/upload'} component={UploadEditor} />

                            <Route exact path={'/app/message/messageTemplate'} component={MessageTemplate} />
                            <Route exact path={'/app/message/messageHistory'} component={MessageHistory} />

                            <Route exact path={'/app/alarm/alarmNotifyType'} component={AlarmNotifyType} />
                            <Route exact path={'/app/alarm/alarmUser'} component={AlarmUser} />
                            <Route exact path={'/app/alarm/alarmRule'} component={AlarmRule} />
                            <Route exact path={'/app/alarm/alarmDealLog'} component={AlarmDealLog} />
                            <Route exact path={'/app/active/activelogQuery'} component={ActivelogQuery} />
                            <Route exact path={'/app/crontab/list'} component={crontabListPage} />
                            <Route exact path={'/app/crontab/task'} component={taskListPage} />
                            <Route exact path={'/app/crontab/log/:id?'} component={logListPage} />
                            <Route component={noMatch} />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}
