import React, {useEffect, useState} from "react"
import {Alert, Button, Card, Checkbox, Divider, Form, message, Tag} from 'antd'
import moment from "moment"
import record from "../../services/record"


function NoProblem() {
    return (
        <div>
            <Alert type={"error"} message={"没有找到该题目！"} style={{textAlign: 'center'}} />
        </div>
    )
}


function ProblemOptions(props) {
    const { options, type } = props
    let optionList = []
    if (type === '判断') {
        optionList.push('正确')
        optionList.push('错误')
    } else {
        optionList = options.split(',')
    }
    let A = 65
    optionList = optionList.map((item, index) => {
        return String.fromCharCode(A + index) + '. ' + item
    })

    return (
        <div>
            {
                optionList.map((item, index) => <div key={index}>
                    <Alert type={"info"} message={item} />
                    <Divider />
                </div> )
            }
        </div>
    )
}


function ProblemAnswer(props) {
    const [flag, setFlag] = useState(false)
    const { options, type, answer, analysis, id } = props.problem
    const currentContest = JSON.parse(localStorage.getItem("currentContest"))
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    const role = localStorage.getItem('type')
    let cnt
    if (type === '判断') {
        cnt = 2
    } else {
        cnt = options.split(',').length
    }
    const list = []
    for (let i = 0; i < cnt; i++) {
        list.push(String.fromCharCode(65 + i))
    }

    useEffect(() => {
        record.existsRecord(userInfo.id, currentContest.id, id).then(resp => {
            if (resp.code === 0) {
                setFlag(resp.data.existsRecord)
            } else {
                const msg = resp.message ? resp.message : '获取数据失败！'
                message.error(msg)
            }
        }).catch(err => {
            console.log(err)
        })
    }, [id, currentContest.id, userInfo.id])

    const submitAnswer = (values) => {
        // 判断比赛是否结束
        if (moment().isAfter(currentContest.endTime)) {
            message.info('比赛已经结束了！')
            return;
        }
        // 判断当前的角色（只有学生能提交，教师和管理员不能）
        if (role !== 'student') {
            message.info('只有学生能提交！')
            return
        }
        // 判断是否已经提交
        if (flag) {
            message.info('请勿重复提交！')
            return
        }
        // 判断答案是否正确
        const myAnswer = values.answer
        const answerList = answer.split(',')
        if (myAnswer.toString() === answerList.toString()) {
            message.success('答案正确！')
        } else {
            message.error('答案错误！')
        }
        setFlag(true)
        // 向后端提交数据
        let option = ''
        for (let i = 0; i < myAnswer.length; i++) {
            if (i === 0) {
                option += myAnswer[i]
            } else {
                option += (',' + myAnswer[i])
            }
        }
        record.submitRecord(userInfo.id, currentContest.id, id, option).then(resp => {
            if (resp.code) {
                const msg = resp.message ? resp.message : '获取数据失败！'
                message.error(msg)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div>
            {!flag && (
                <div>
                    <Form name={"answerForm"} layout={"inline"} onFinish={submitAnswer}>
                        <Form.Item name={"answer"}
                                   label={"你的答案"}>
                            <Checkbox.Group>
                                {
                                    list.map((item, index) => <Checkbox key={index} value={item}>{item}</Checkbox>)
                                }
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item>
                            <Button type={"primary"} htmlType={"submit"}>提交</Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
            {flag && (
                <div>
                    <Divider />
                    <Alert type={"success"} message={"正确答案：" + answer} />
                    <Divider />
                    <Alert type={"info"} message={"解析：" + analysis} />
                </div>
            )}
        </div>
    )
}


function ProblemDetail(props) {
    const problem = props.problem
    return (
        <div>
            <Card>
                <Tag color={"red"}>{problem.type}</Tag>
                <Divider />
                <Alert type={"info"} message={problem.describe} />
                <Divider />
                <ProblemOptions options={problem.options}
                                type={problem.type} />
                <ProblemAnswer problem={problem} />
            </Card>
        </div>
    )
}


function ProblemComponent(props) {
    const problem = props.problem
    return (
        <div>
            {
                problem == null ? <NoProblem /> : <ProblemDetail problem={problem} />
            }
        </div>
    )
}

export default ProblemComponent