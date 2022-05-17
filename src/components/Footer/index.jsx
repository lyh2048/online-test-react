import React from "react"
import {Col, Row} from 'antd'
import styles from './index.module.css'


export default function Footer() {
    return (
        <div>
            <Row>
                <Col span={12} offset={6}>
                    <span className={styles.footerText}>All Copyright Reserved © 2022</span>
                </Col>
            </Row>
        </div>
    )
}