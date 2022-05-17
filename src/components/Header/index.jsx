import React from "react"
import {Row, Col, message} from 'antd'
import styles from './index.module.css'
import user from '../../services/user'
import {NavLink} from "react-router-dom"


export default function Header() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const username = userInfo.username
    const type = localStorage.getItem('type')
    const menuObject = {
        'admin': [
            {
                id: 1,
                name: '题目',
                path: '/main/problem'
            },
            {
                id: 2,
                name: '班级',
                path: '/main/group'
            },
            {
                id: 3,
                name: '管理',
                path: '/main/manage'
            }
        ],
        'student': [
            {
                id: 1,
                name: '题目',
                path: '/main/problem'
            },
            {
                id: 2,
                name: '班级',
                path: '/main/group'
            },
        ],
        'teacher': [
            {
                id: 1,
                name: '题目',
                path: '/main/problem'
            },
            {
                id: 2,
                name: '班级',
                path: '/main/group'
            },
        ]
    }

    const handleLogoutClick = () => {
        user.logout().then(async resp => {
            if (resp.code === 0) {
                localStorage.removeItem('token')
                localStorage.removeItem('type')
                localStorage.removeItem('userInfo')
                window.location.href = '#/login'
                message.success('退出成功')
            } else {
                message.error('退出失败')
            }
        })
    }

    return (
        <div>
            <Row className={styles.nav}>
                <Col span={2} className={styles.navItem}>
                    <h2>OnlineTest</h2>
                </Col>
                {
                    menuObject[type].map(item => <Col
                        span={1}
                        className={styles.navItem}
                        key={item.id}><span className={styles.navText}>
                        <NavLink to={item.path}
                                 activeClassName={styles.navLinkActive}>
                            {item.name}
                        </NavLink>
                    </span></Col>)
                }
                <Col className={styles.navItem}
                     span={1}
                     offset={20 - menuObject[type].length}>
                    <span className={styles.navText}>{username}</span>
                </Col>
                <Col className={styles.navItem} span={1}>
                    <span className={styles.navText} onClick={() => handleLogoutClick()}>退出</span>
                </Col>
            </Row>
        </div>
    )
}