import React, {useEffect, useState} from "react"
import {Row, Col, Button, Pagination, Table, Space} from 'antd'
import styles from './index.module.css'
import {PAGE_SIZE} from "../../common/constant"
import student from "../../services/student"
import teacher from "../../services/teacher"
import subject from "../../services/subject"
import group from "../../services/group"


const teacherColumn = [
    {
        title: '编号',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: () => <Space size={"middle"}>
            <Button type={"primary"}>编辑</Button>
            <Button type={"primary"} danger>删除</Button>
        </Space>
    }
]

const studentColumn = [
    {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname'
    },
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
    },
    {
        title: '班级',
        dataIndex: 'className',
        key: 'className'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: () => <Space size={"middle"}>
            <Button type={"primary"}>编辑</Button>
            <Button type={"primary"} danger>删除</Button>
        </Space>
    }
]

const subjectColumn = [
    {
        title: '编号',
        key: 'id',
        dataIndex: 'id'
    },
    {
        title: '名称',
        key: 'name',
        dataIndex: 'name'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: () => <Space size={"middle"}>
            <Button type={"primary"}>编辑</Button>
            <Button type={"primary"} danger>删除</Button>
        </Space>
    }
]

const groupColumn = [
    {
        title: '编号',
        key: 'id',
        dataIndex: 'id'
    },
    {
        title: '名称',
        key: 'name',
        dataIndex: 'name'
    },
    {
        title: '人数',
        key: 'members',
        dataIndex: 'members'
    },
    {
        title: '教师',
        key: 'teacherName',
        dataIndex: 'teacherName'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: () => <Space size={"middle"}>
            <Button type={"primary"}>编辑</Button>
            <Button type={"primary"} danger>删除</Button>
        </Space>
    }
]

export default function Manage() {
    const [pageNo, setPageNo] = useState(1)
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(PAGE_SIZE)
    const [type, setType] = useState('student')
    const [tableData, setTableData] = useState([])
    const [tableColumn, setTableColumn] = useState([])
    const handleOnChange = (current, size) => {
        setPageNo(current)
        setPageSize(size)
    }
    const handleButtonClick = (type) => {
        setType(type)
    }

    useEffect(() => {
        const getClassName = async (classId) => {
            if (!classId) {
                return ''
            }
            const resp = await group.getGroupByGroupId(classId)
            const name = resp.data.name
            return name ? name : ''
        }
        const getTeacherName = async (teacherId) => {
            if (!teacherId) {
                return ''
            }
            const resp = await teacher.getTeacherById(teacherId)
            const username = resp.data.username
            return username ? username : ''
        }
        const pageStudent = () => {
            student.pageStudent(pageNo, pageSize).then(async resp => {
                setPageNo(resp.data.pageNo)
                setTotal(resp.data.pageTotalCount)
                const list = []
                for (let item of resp.data.items) {
                    const className = await getClassName(item.classId)
                    list.push({
                        key: item.id,
                        id: item.id,
                        email: item.email,
                        nickname: item.nikename,
                        username: item.username,
                        classId: item.classId,
                        className: className
                    })
                }
                setTableData(list)
                setTableColumn(studentColumn)
            }).catch(err => {
                console.log(err)
            })
        }
        const pageTeacher = () => {
            teacher.pageTeacher(pageNo, pageSize).then(resp => {
                setPageNo(resp.data.pageNo)
                setTotal(resp.data.pageTotalCount)
                const list = resp.data.items.map(item => {
                    return {
                        key: item.id,
                        id: item.id,
                        email: item.email,
                        username: item.username
                    }
                })
                setTableColumn(teacherColumn)
                setTableData(list)
            }).catch(err => {
                console.log(err)
            })
        }
        const pageSubject = () => {
            subject.pageSubject(pageNo, pageSize).then(resp => {
                setPageNo(resp.data.pageNo)
                setTotal(resp.data.pageTotalCount)
                const list = resp.data.items.map(item => {
                    return {
                        key: item.id,
                        id: item.id,
                        name: item.name
                    }
                })
                setTableData(list)
                setTableColumn(subjectColumn)
            }).catch(err => {
                console.log(err)
            })
        }
        const pageClass = () => {
            group.pageGroup(pageNo, pageSize).then(async resp => {
                setPageNo(resp.data.pageNo)
                setTotal(resp.data.pageTotalCount)
                const list = []
                for (let item of resp.data.items) {
                    const teacherName = await getTeacherName(item.teacherId)
                    list.push({
                        key: item.id,
                        id: item.id,
                        members: item.members,
                        name: item.name,
                        teacherId: item.teacherId,
                        teacherName: teacherName
                    })
                }
                setTableData(list)
                setTableColumn(groupColumn)
            }).catch(err => {
                console.log(err)
            })
        }
        switch (type) {
            case 'student':
                pageStudent()
                break
            case 'teacher':
                pageTeacher()
                break
            case 'subject':
                pageSubject()
                break
            case 'class':
                pageClass()
                break
            default:
                console.log('未知的类型: ' + type)
                break
        }
    }, [pageNo, pageSize, type])


    return (
        <div>
            <Row className={styles.btnBox}>
                <Col span={6} offset={18}>
                    <Button type={"default"} onClick={() => handleButtonClick('student')}>学生</Button>
                    <Button type={"default"} onClick={() => handleButtonClick('teacher')}>教师</Button>
                    <Button type={"default"} onClick={() => handleButtonClick('subject')}>课程</Button>
                    <Button type={"default"} onClick={() => handleButtonClick('class')}>班级</Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table dataSource={tableData}
                           columns={tableColumn}
                           pagination={false} />
                </Col>
            </Row>
            <Row className={styles.pageBox}>
                <Col span={12} offset={6}>
                    <Pagination current={pageNo}
                                style={{textAlign: 'center', height: '32px', lineHeight: '32px'}}
                                total={total}
                                defaultCurrent={1}
                                defaultPageSize={PAGE_SIZE}
                                onChange={handleOnChange} />
                </Col>
            </Row>
        </div>
    )
}