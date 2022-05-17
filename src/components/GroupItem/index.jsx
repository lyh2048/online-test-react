import React, {useEffect, useState} from "react"
import teacher from "../../services/teacher"
import { Card, Space } from 'antd'
import { UserOutlined, ClusterOutlined } from '@ant-design/icons'
import styles from './index.module.css'
import {withRouter} from 'react-router-dom'


function GroupItem(props) {
    const [teacherName, setTeacherName] = useState('')
    useEffect(() => {
        const teacherId = props.teacherId
        teacher.getTeacherById(teacherId).then(resp => {
            setTeacherName(resp.data.username)
        }).catch(err => {
            console.log(err)
        })
    }, [props.teacherId])
    return (
        <div onClick={() => props.history.push(`/main/groupDetail/${props.id}`)}>
            <Card style={{margin: '20px'}}>
                <div className={styles.box}>
                    <div className={styles.left}>
                        <img src={props.image} alt={props.name} width={"100px"} height={"100px"} />
                    </div>
                    <div className={styles.right}>
                        <div className={styles.groupNameText}>{props.name}</div>
                        <div className={styles.groupText}>
                            <Space size={"middle"}>
                                <ClusterOutlined />
                                {teacherName}
                            </Space>
                        </div>
                        <div className={styles.groupText}>
                            <Space size={"middle"}>
                                <UserOutlined />
                                {props.members}
                            </Space>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default withRouter(GroupItem)