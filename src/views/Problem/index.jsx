import React, {useEffect, useState} from "react"
import {Button, Col, Row, Space, Table, Tag, Form, Input, Select, Pagination} from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import problem from "../../services/problem"
import subject from "../../services/subject"
import styles from './index.module.css'
import {PAGE_SIZE} from "../../common/constant"

const { Column } = Table
const { Option } = Select
const typeList = [
    {
        id: 1,
        name: '所有'
    },
    {
        id: 2,
        name: '单选'
    },
    {
        id: 3,
        name: '多选'
    },
    {
        id: 4,
        name: '判断'
    }
]
const pageSize = PAGE_SIZE

export default function Problem() {
    const [problemList, setProblemList] = useState([])
    const [subjectList, setSubjectList] = useState([])
    const [tableData, setTableData] = useState([])
    const [pageNo, setPageNo] = useState(1)
    const [total, setTotal] = useState(0)
    const getProblemList = (pageNo = 1, pageSize = 10) => {
        problem.getProblemList(pageNo, pageSize).then(resp => {
            setProblemList(resp.data.items)
            setPageNo(resp.data.pageNo)
            const pageTotal = resp.pageTotalCount
            setTotal(pageTotal)
        }).catch(err => {
            console.log(err)
        })
    }
    const getAllSubjects = () => {
        subject.getAllSubjects().then(resp => {
            setSubjectList(resp.data.subjects)
        }).catch(err => {
            console.log(err)
        })
    }
    const handleSearchButtonClick = (values) => {
        let {subject, title, type} = values
        if (!subject) {
            subject = 0
        }
        if (!type) {
            type = '所有'
        }
        if (!title) {
            title = ''
        }
        problem.searchProblem(pageNo, pageSize, subject, title, type).then(resp => {
            setProblemList(resp.data.items)
            setPageNo(resp.data.pageNo)
            const pageTotal = resp.pageTotalCount
            setTotal(pageTotal)
        }).catch(err => {
            console.log(err)
        })
    }
    const handlePageNoChange = (page) => {
        setPageNo(page)
    }
    useEffect(() => {
        getAllSubjects()
    }, [])
    useEffect(() => {
        getProblemList(pageNo, pageSize)
    }, [pageNo])
    useEffect(() => {
        const getSubjectName = (subjectId) => {
            if (subjectList.length === 0) {
                return ''
            }
            for (let item of subjectList) {
                if (item.id === subjectId) {
                    return item.name
                }
            }
            return ''
        }
        const list = problemList.map(item => {
            return {
                key: item.id,
                id: item.id,
                describe: item.describe,
                type: item.type,
                subjectId: item.subjectId,
                subjectName: getSubjectName(item.subjectId)
            }
        })
        setTableData(list)
    }, [problemList, subjectList])

    return (
        <div>
            <Row className={styles.searchBox}>
                <Col span={14} offset={5}>
                    <Form layout={"inline"}
                          onFinish={handleSearchButtonClick}
                          name={"searchForm"}>
                        <Form.Item label={"科目"} name={"subject"}>
                            <Select
                                placeholder="选择科目"
                                allowClear
                            >
                                {
                                    subjectList.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label={"标题"} name={"title"}>
                            <Input />
                        </Form.Item>
                        <Form.Item label={"类型"} name={"type"}>
                            <Select
                                placeholder="选择题目类型"
                                allowClear
                            >
                                {
                                    typeList.map(item => <Option value={item.name} key={item.id}>{item.name}</Option>)
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Space size={"middle"}>
                                <Button type="primary"
                                        htmlType="submit"
                                        icon={<SearchOutlined />}>
                                    搜索
                                </Button>
                                <Button type={"primary"}
                                        icon={<PlusOutlined />}>
                                    添加题目
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table dataSource={tableData}
                           pagination={false}>
                        <Column title="科目" dataIndex="subjectName" key="subjectName" />
                        <Column title="编号" dataIndex="id" key="id" />
                        <Column title="标题" dataIndex="describe"
                                key="describe" render={(text) => <span>
                            {text.length > 20 ? text.substring(0, 20) + '……' : text}
                        </span>} />
                        <Column title="类型"
                                dataIndex="type"
                                key="type"
                                render={(text) => <Tag color={"red"}>{text}</Tag>} />
                        <Column title="操作"
                                dataIndex="action"
                                key="action"
                                render={() => <Space size={"middle"}>
                            <Button type={"primary"}>编辑</Button>
                            <Button type={"primary"} danger={true}>删除</Button>
                        </Space>} />
                    </Table>
                </Col>
            </Row>
            <Row className={styles.pageBox}>
                <Col span={12} offset={6}>
                    <Pagination current={pageNo}
                                style={{textAlign: 'center', height: '32px', lineHeight: '32px'}}
                                total={total}
                                defaultPageSize={pageSize}
                                onChange={handlePageNoChange} />
                </Col>
            </Row>
        </div>
    )
}