import React, {useState} from "react"
import {Card, Form, Input, Button, Radio, message, Row, Col} from 'antd'
import styles from './index.module.css'
import user from '../../services/user'
import {BASE_URL} from '../../common/constant'


const captchaImageUrl = BASE_URL + '/captcha.jpg'

const tabList = [
    {
        key: 'tab1',
        tab: '登录',
    },
    {
        key: 'tab2',
        tab: '注册',
    },
]


const login = (values) => {
    const { username, password, type } = values
    user.login(username, password, type).then(async resp => {
        if (resp.code === 0) {
            const {token, userInfo} = resp.data
            localStorage.setItem('token', token)
            localStorage.setItem('type', type)
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            window.location.href = "#/main"
            message.success('登录成功')
        } else {
            const msg = resp.message ? resp.message : '登录失败！'
            message.error(msg)
        }
    })
}

const register = (values) => {
    const { username1, password1, type, code, email } = values
    user.register(username1, password1, email, code, type).then(async resp => {
        if (resp.code === 0) {
            window.location.reload();
            message.success('注册成功')
        } else {
            const msg = resp.message ? resp.message : '注册失败！'
            message.error(msg)
        }
    })
}

const handleCaptchaClick = () => {
    let newCaptchaImageUrl = captchaImageUrl + '?t=' + new Date().getTime()
    const captcha = document.getElementById('captcha')
    captcha.setAttribute('src', newCaptchaImageUrl)
}

const contentList = {
    tab1: <Form
        name="loginForm"
        labelCol={{
            span: 4,
        }}
        wrapperCol={{
            span: 16,
        }}
        initialValues={{
            type: 'student',
        }}
        onFinish={login}
        autoComplete="off"
    >
        <Form.Item
            label="用户名"
            name="username"
            rules={[
                {
                    required: true,
                    message: '请输入用户名！',
                },
            ]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="密码"
            name="password"
            rules={[
                {
                    required: true,
                    message: '请输入密码！',
                },
            ]}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item
            label={"账号类型"}
            name="type"
            rules={[
                {
                    required: true,
                    message: '请选择账号类型'
                }
            ]}
        >
            <Radio.Group>
                <Radio.Button value={"student"}>学生</Radio.Button>
                <Radio.Button value={"teacher"}>教师</Radio.Button>
                <Radio.Button value={"admin"}>管理员</Radio.Button>
            </Radio.Group>
        </Form.Item>

        <Form.Item
            wrapperCol={{
                offset: 4,
                span: 16,
            }}
        >
            <Button type="primary" htmlType="submit">
                登录
            </Button>
        </Form.Item>
    </Form>,
    tab2: <Form
        name="registerForm"
        labelCol={{
            span: 4,
        }}
        wrapperCol={{
            span: 16,
        }}
        initialValues={{
            type: 'student',
        }}
        onFinish={register}
        autoComplete="off"
    >
        <Form.Item
            label="用户名"
            name="username1"
            rules={[
                {
                    required: true,
                    message: '请输入用户名！',
                },
            ]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="密码"
            name="password1"
            rules={[
                {
                    required: true,
                    message: '请输入密码！',
                },
            ]}
        >
            <Input.Password />
        </Form.Item>
        <Form.Item
            name="confirm"
            label="确认密码"
            dependencies={['password1']}
            hasFeedback
            rules={[
                {
                    required: true,
                    message: '请输入密码！',
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password1') === value) {
                            return Promise.resolve();
                        }

                        return Promise.reject(new Error('两次输入的密码不一致！'));
                    },
                }),
            ]}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item
            label="邮箱"
            name="email"
            rules={[
                {
                    required: true,
                    message: '请输入邮箱！',
                },
                {
                    type: 'email',
                    message: '邮箱格式错误！'
                }
            ]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label={"账号类型"}
            name="type"
            rules={[
                {
                    required: true,
                    message: '请选择账号类型'
                }
            ]}
        >
            <Radio.Group>
                <Radio.Button value={"student"}>学生</Radio.Button>
                <Radio.Button value={"teacher"}>教师</Radio.Button>
            </Radio.Group>
        </Form.Item>

        <Form.Item label="验证码" extra="We must make sure that your are a human.">
            <Row gutter={8}>
                <Col span={12}>
                    <Form.Item
                        name="code"
                        noStyle
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <img
                        id={"captcha"}
                        onClick={() => handleCaptchaClick()}
                        style={{height: '32px', width: '100px'}}
                        src={captchaImageUrl}
                        alt={"captcha"}
                    />
                </Col>
            </Row>
        </Form.Item>

        <Form.Item
            wrapperCol={{
                offset: 4,
                span: 16,
            }}
        >
            <Button type="primary" htmlType="submit">
                注册
            </Button>
        </Form.Item>
    </Form>
}



export default function Login() {
    const [activeTabKey, setActiveTabKey] = useState('tab1')
    const onTabChange = key => {
        setActiveTabKey(key);
    }
    return (
        <div className={styles.box}>
            <Card className={styles.card}
                  bordered={false}
                  tabList={tabList}
                  activeTabKey={activeTabKey}
                  onTabChange={key => onTabChange(key)}>
                {contentList[activeTabKey]}
            </Card>
        </div>
    )
}