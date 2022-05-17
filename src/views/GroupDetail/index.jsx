import React, {useEffect, useState} from 'react'
import {Row, Col, Button, Card, Divider, Table, Tag, message, Modal, Form, Input, DatePicker} from 'antd'
import group from "../../services/group"
import problem from "../../services/problem"
import test from "../../services/test"
import styles from './index.module.css'
import moment from "moment"
import {getTimeLength, getTime2Length} from '../../utils/TimeUtil'
import {NavLink} from "react-router-dom";


const { RangePicker } = DatePicker


const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    },
}

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
}

const testColumnList = [
    {
        title: '标题',
        key: 'name',
        dataIndex: 'name',
        render: (text, record) => <NavLink to={`/main/contest/${record.id}`}>{text}</NavLink>
    },
    {
        title: '开始时间',
        key: 'startTime',
        dataIndex: 'startTime'
    },
    {
        title: '时长',
        key: 'time',
        dataIndex: 'time'
    }
]

function getTestDataSource(list) {
    return list.map(item => {
        return {
            key: item.id,
            id: item.id,
            name: item.name,
            time: getTimeLength(item.time),
            startTime: moment(item.startTime).format('YYYY-MM-DD HH:mm:ss')
        }
    })
}

const memberColumnList = [
    {
        title: '角色',
        key: 'role',
        dataIndex: 'role',
        render: text => <Tag color={"blue"}>{text}</Tag>
    },
    {
        title: '昵称',
        key: 'nickname',
        dataIndex: 'nickname'
    },
    {
        title: '用户名',
        key: 'username',
        dataIndex: 'username',
    }
]

function getMemberDataSource(list) {
    return list.map(item => {
        return {
            key: item.id,
            id: item.id,
            nickname: item.nikename,
            username: item.username,
            role: '学生'
        }
    })
}

const problemColumnList = [
    {
        title: '编号',
        key: 'id',
        dataIndex: 'id'
    },
    {
        title: '题目描述',
        key: 'describe',
        dataIndex: 'describe'
    }
]

function GroupDetail(props) {
    const classId = props.match.params.id
    const [classInfo, setClassInfo] = useState({
        id: '',
        image: '',
        name: '',
        members: '',
        teacherId: ''
    })
    const [teacherInfo, setTeacherInfo] = useState({
        username: '',
        id: '',
        email: ''
    })
    const [studentList, setStudentList] = useState([])
    const [testList, setTestList] = useState([])
    const [problemList, setProblemList] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        group.getGroupInfo(classId).then(resp => {
            const {data} = resp
            setClassInfo(data.curClass)
            setTeacherInfo(data.curTeacher)
            setStudentList(data.studentList)
            setTestList(data.testList)
        }).catch(err => {
            console.log(err)
        })
    }, [classId])

    useEffect(() => {
        problem.getAllProblems().then(resp => {
            const list = resp.data.map(item => {
                return {
                    key: item.id,
                    id: item.id,
                    describe: item.describe.length > 20 ? item.describe.substring(0, 20) + '……' : item.describe
                }
            })
            setProblemList(list)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const handleCreateContestButtonClick = () => {
        const type = localStorage.getItem('type')
        if (type === 'student') {
            message.info('学生不能创建比赛，请联系班级教师或管理员')
            return;
        }
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedList(selectedRows)
        }
    }

    const submit = (values) => {
        const { title, time } = values
        const classId = classInfo.id
        const startTime = moment(time[1]).format('YYYY-MM-DD HH:mm:ss')
        const ids = selectedList.map(item => {
            return item.id
        })
        const len = getTime2Length(time[1], time[0])
        test.createTest(classId, title, startTime, len, ids).then(resp => {
            if (resp.code === 0) {
                message.success('操作成功！')
                setIsModalVisible(false)
                window.location.reload()
            } else {
                const msg = resp.message ? resp.message : '创建失败！'
                message.error(msg)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div className={styles.box}>
            <Row>
                <Col span={4} offset={4}>
                    <img src={classInfo.image} alt={classInfo.name} style={{width: "100%"}} />
                    <div className={styles.classInfoBox}>
                        <div className={styles.classInfoItem}>
                            <h3>{classInfo.name}</h3>
                        </div>
                        <div className={styles.classInfoItem}>
                            <span>教师：{teacherInfo.username}</span>
                        </div>
                        <div className={styles.classInfoItem}>
                            <span>人数：{classInfo.members}</span>
                        </div>
                        <div className={styles.classInfoItem}>
                            <span>比赛数：{testList.length}</span>
                        </div>
                    </div>
                </Col>
                <Col span={12} offset={1}>
                    <div className={styles.headBox}>
                        <h2>{classInfo.name}</h2>
                        <Button type={"primary"} onClick={() => handleCreateContestButtonClick()}>创建比赛</Button>
                    </div>
                    <Card className={styles.contestBox}>
                        <div>
                            <h2>比赛</h2>
                        </div>
                        <Divider />
                        <Table pagination={false}
                               columns={testColumnList}
                               dataSource={getTestDataSource(testList)} />
                    </Card>
                    <Card className={styles.memberBox}>
                        <div>
                            <h2>成员</h2>
                            <Divider />
                            <Table pagination={false}
                                   columns={memberColumnList}
                                   dataSource={getMemberDataSource(studentList)} />
                        </div>
                    </Card>
                </Col>
            </Row>
            <Modal title="创建比赛"
                   width={"60%"}
                   visible={isModalVisible}
                   footer={null}
                   onCancel={handleCancel}>
                <Form name={"contestForm"}
                      onFinish={submit}
                      {...formItemLayout}>
                    <Form.Item label={"班级"} name={"className"}>
                        <span>{classInfo.name}</span>
                    </Form.Item>
                    <Form.Item label={"标题"}
                               name={"title"}
                               rules={[{required: true, message: '请输入标题！'}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={"time"}
                               rules={[{ type: 'array', required: true, message: '请选择时间！' }]}
                               label={"时间"}>
                        <RangePicker format={"YYYY-MM-DD HH:mm:ss"} showTime />
                    </Form.Item>
                    <Form.Item name={"problem"}
                               label={"问题"}>
                        <Table
                            rowSelection={{
                                type: 'checkbox',
                                ...rowSelection,
                            }}
                            dataSource={problemList}
                            columns={problemColumnList}
                        />
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            创建
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default GroupDetail