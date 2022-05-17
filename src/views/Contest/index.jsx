import React, {useEffect, useState} from "react"
import { withRouter } from 'react-router-dom'
import test from '../../services/test'
import student from "../../services/student"
import {Row, Col, Card, Tag, Statistic, Tabs, Table, Button, Divider} from 'antd'
import styles from './index.module.css'
import moment from "moment"
import {getTimeObject} from "../../utils/TimeUtil"
import ProblemComponent from "../../components/ProblemComponent"

const {Countdown} = Statistic
const { TabPane } = Tabs

const table1ColumnList = [
    {
        title: '题目编号',
        key: 'id',
        dataIndex: 'id'
    },
    {
        title: '题目描述',
        key: 'describe',
        dataIndex: 'describe'
    },
    {
        title: '答题情况',
        key: 'status',
        dataIndex: 'status',
        render: (text) => <Tag color={"red"}>{text}</Tag>
    }
]

const table3ColumnList = [
    {
        title: '排名',
        key: 'rank',
        dataIndex: 'rank'
    },
    {
        title: '用户名',
        key: 'name',
        dataIndex: 'name'
    },
    {
        title: '得分',
        key: 'score',
        dataIndex: 'score',
        render: (text) => <Tag color={"blue"}>{text}</Tag>
    }
]

function Contest(props) {
    const id = props.match.params.id
    const [curTest, setCurTest] = useState({
        classId: '',
        id: '',
        name: '',
        startTime: '',
        endTime: '',
        time: ''
    })
    const [tableData1, setTableData1] = useState([])
    const [tableData3, setTableData3] = useState([])
    const [problemList, setProblemList] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    localStorage.setItem("currentContest", JSON.stringify(curTest))

    useEffect(() => {
        const getStudentName = async (studentId) => {
            if (!studentId) {
                return ''
            }
            const resp = await student.getStudentById(studentId)
            const username = resp.data.username
            return username ? username : ''
        }
        test.getContestDetail(id).then(async resp => {
            const obj = resp.data.curTest
            const problemList = resp.data.testProblemList
            const problemStatusList = resp.data.testProblemStatusList
            const rankItemList = resp.data.rankItemList
            const timeObject = getTimeObject(obj.time)
            obj.startTime = moment(obj.startTime).format('YYYY-MM-DD HH:mm:ss')
            obj.endTime = moment(obj.startTime)
                .add(timeObject.hour, 'h')
                .add(timeObject.minute, 'm')
                .add(timeObject.second, 's').format('YYYY-MM-DD HH:mm:ss')
            const tableData1List = []
            for (let item of problemList) {
                const id = item.id
                let status = null
                for (let it of problemStatusList) {
                    if (it.problemId === id) {
                        status = it
                        break
                    }
                }
                tableData1List.push({
                    id: item.id,
                    key: item.id,
                    describe: item.describe.length > 20 ? item.describe.substring(0, 20) + '……' : item.describe,
                    status: status === null ? '' : status.correct + '/' + status.total
                })
            }
            const tableData3List = []
            let i = 1
            for (let item of rankItemList) {
                const name = await getStudentName(item.studentId)
                tableData3List.push({
                    id: item.studentId,
                    key: item.studentId,
                    score: item.score,
                    rank: i,
                    name: name
                })
                i += 1
            }
            setCurTest(obj)
            setTableData3(tableData3List)
            setTableData1(tableData1List)
            setProblemList(problemList)
        }).catch(err => {
            console.log(err)
        })
    }, [id])


    const handleButtonClick = (index) => {
        setCurrentIndex(index)
    }

    return (
        <div>
            <Row className={styles.headBox}>
                <Col span={16} offset={4}>
                    <Card>
                        <h2 style={{textAlign: 'center'}}>{curTest.name}</h2>
                        <div className={styles.headBoxContent}>
                            <div className={styles.left}>开始时间：{curTest.startTime}</div>
                            <div className={styles.center}>
                                {
                                    moment().isBefore(curTest.endTime) ?
                                        <Countdown title="距离比赛结束还有" value={moment(curTest.endTime)} format="D 天 H 时 m 分 s 秒" /> :
                                        <Tag color={"green"}>比赛已经结束</Tag>
                                }
                            </div>
                            <div className={styles.right}>结束时间：{curTest.endTime}</div>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row className={styles.footBox}>
                <Col span={16} offset={4}>
                    <Tabs>
                        <TabPane tab={"详情"} key={"1"}>
                            <Table dataSource={tableData1} pagination={false} columns={table1ColumnList} />
                        </TabPane>
                        <TabPane tab={"问题"} key={"2"}>
                            <Card>
                                <div className={styles.buttonBox}>
                                    {
                                        problemList.map((item, index) => <Button key={item.id}
                                                                                 onClick={() => handleButtonClick(index)}
                                                                                 type={"default"}>
                                            {index+1}
                                        </Button>)
                                    }
                                </div>
                                <Divider />
                                <ProblemComponent problem={problemList.length === 0 ? null : problemList[currentIndex]} />
                            </Card>
                        </TabPane>
                        <TabPane tab={"排名"} key={"3"}>
                            <Table dataSource={tableData3} pagination={false} columns={table3ColumnList} />
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
    )
}

export default withRouter(Contest)