import React, { Component } from 'react'; 
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import { Card, Avatar, Row, Col, Progress, Timeline, Collapse, Table, Icon } from 'antd';
import zysoft from '../../style/img/avatar.jpg';
import ncs from '../../style/img/ncs.jpeg';
import './index.less';
import CountUp from 'react-countup';
import ReactEcharts from 'echarts-for-react';
const { Meta } = Card;

const Panel = Collapse.Panel;
const classify = [
    "社会",
    "爱情",
    "友情"
];
const text = [
    "只有人们的社会实践，才是人们对于外界认识的真理性的标准。真理的标准只能是社会的实践。",
    "这世界要是没有爱情，它在我们心中还会有什么意义！这就如一盏没有亮光的走马灯。",
    "友谊是灵魂的结合，这个结合是可以离异的，这是两个敏感，正直的人之间心照不宣的契约。"
];
const author = [
    " —— 毛泽东",
    " —— 歌德",
    " —— 伏尔泰"
];

const columns = [
    { title: '头像', width: 100, dataIndex: 'img', key: 'img', fixed: 'left' },
    { title: '姓名', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
    { title: '状态', width: 80, dataIndex: 'state', key: 'state', fixed: 'left' },
    { title: '留言', width: '62%', dataIndex: 'written', key: 'written', className:'column-written' },
    { title: '邮箱', width: 200,dataIndex: 'mail', key: 'mail', fixed: 'right' },
    { title: '时间', width: 200,dataIndex: 'time', key: 'time', fixed: 'right' }
];
const data = [{
    key: '1',
    img: <Avatar style={{ backgroundColor: '#f56a00' }}>Z</Avatar>,
    name: 'John Brown',
    state: <Icon type="caret-up" style={{ color: 'red' }}/>,
    written: '撸起袖子加油干，中国梦定能实现！',
    mail: 'marinus.jagesar@example.com',
    time: '2015-03-01 17:55:21',
}, {
    key: '2',
    img: <Avatar style={{ backgroundColor: '#7265e6' }}>H</Avatar>,
    name: 'Jim Green',
    state: <Icon type="caret-up" style={{ color: 'red' }}/>,
    written: '只要坚持一切为了人民，共产党就始终有其活力。',
    mail: 'zachary.lavigne@example.com',
    time: '2015-06-03 18:22:13',
},{
    key: '3',
    img: <Avatar style={{ backgroundColor: '#ffbf00' }}>A</Avatar>,
    name: 'Joe Black',
    state: <Icon type="caret-down" style={{ color: 'gray' }}/>,
    written: '跟着党中央，百姓不心慌。跟着习核心，党民一家亲。',
    mail:'levi.willis@example.com',
    time: '2016-01-02 23:11:01',
},{
    key: '4',
    img: <Avatar style={{ backgroundColor: '#00a2ae' }}>O</Avatar>,
    name: 'Jim Red',
    state:<Icon type="caret-up" style={{ color: 'red' }}/>,
    written: '必须坚持改革创新、将改革进行到底！只有在改革中推动社会发展、在创新中找到科学发展之路！',
    mail: 'tobias.pedersen@example.com',
    time: '2016-12-21 13:03:59',
},{
    key: '5',
    img: <Avatar style={{ backgroundColor: '#48ae6a' }}>Y</Avatar>,
    name: 'Jake White',
    state: <Icon type="caret-down" style={{ color: 'gray' }}/>,
    written: '在各领域凝心聚力齐心协力集聚改革发展的正能量。',
    mail: 'lígio.carvalho@example.com',
    time: '2017-03-06 10:19:07',
},{
    key: '6',
    img: <Avatar style={{ backgroundColor: '#ae007c' }}>U</Avatar>,
    name: 'Smith White',
    state: <Icon type="caret-up" style={{ color: 'red' }}/>,
    written: '对“为官不为”及时亮剑，集中曝光、整治“为官不为”“为官乱为”，使无为者让位、干事者有位。',
    mail: 'samuel.leon@example.com',
    time: '2017-11-03 13:43:33',
}];

export default class MIndex extends Component {
    CountUp(){
        let imgSrc = ["mail","chat","cart","heart"];
        let imgName = ["Mails","Dialogue","Carts","Collection"];
        let count = ["1379","768","192","413"];
        let cu = imgSrc.map(function(item,index){
            return(
                <Col md={6} key={item}>
                    <Card style={{cursor:'pointer', marginBottom:16}}
                          actions={[<Icon type="info-circle-o" />, <Icon type="ellipsis" />]}>
                        <Meta
                            style={{fontSize:22}}
                            avatar={<img src={require('../../style/img/'+item+'.png')} alt=""/>}
                            title={imgName[index]}
                            description={<CountUp start={0} end={count[index]} duration={2.75}/>}
                        />
                    </Card>
                </Col>
            )
        });
        return cu;
    }
    getOption(){
        let option = {
            backgroundColor: "#fff",
            color: ['rgb(216, 151, 235)', 'rgb(246, 152, 153)', 'rgb(100, 234, 145)'],
            title: [{
                text: '账单/亿',
                left: '2%',
                top: '6%',
                textStyle: {
                    fontWeight:'normal',
                },
            }],
            tooltip: {
                trigger: 'axis'
            },
            grid:{
                left:'6%',
                width:'90%',
            },
            legend: {
                //x: 300,
                top: '7%',
                right: '3%',
                textStyle: {
                    color: 'gray',
                },
                data: ['网购', '线下', '其他']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLine:{
                    lineStyle:{
                        color:'lightgray',
                    },
                },
                axisLabel:{
                    color:'gray'
                },
                data: ['2011', '2012', '2013', '2014', '2015', '2016', '2017']
            },
            yAxis: {
                min: 0,
                max: 100,
                type: 'value',
                axisLine:{
                    lineStyle:{
                        color:'lightgray',
                    },
                },
                axisLabel:{
                    color:'gray'
                },
            },
            series: [{
                name: '网购',
                smooth: true,
                type: 'line',
                symbolSize: 8,
                symbol: 'circle',
                data: [10, 40, 32, 20, 80, 90, 97]
            }, {
                name: '线下',
                smooth: true,
                type: 'line',
                symbolSize: 8,
                symbol: 'circle',
                data: [70, 50, 50, 87, 90, 80, 70]
            },{
                name: '其他',
                smooth: true,
                type: 'line',
                symbolSize: 8,
                symbol: 'circle',
                data: [30, 40, 10, 20, 33, 66, 54]
            }]
        };
        return option;
    }
    Panel(){
        let panel = text.map(function(item,index){
            return(
                <Panel header={classify[index]} key={index}>
                    <div>{item}</div>
                    <p className="author">{author[index]}</p>
                </Panel>
            )
        });
        return panel;
    }
    render() {
        return (
            <div className="ani-box">
                <span className="animated flipInX ege">←_← 首页建设中，功能直接操作菜单哈！</span>
                <img src={ncs} width="800" className="animated fadeInUp lastPic" />
            </div>
        )
    }
}
   