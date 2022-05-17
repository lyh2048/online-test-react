import React, {useEffect, useState} from "react"
import styles from './index.module.css'
import group from "../../services/group"
import GroupItem from "../../components/GroupItem";

export default function Group() {
    const [groupList, setGroupList] = useState([])

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        const type = localStorage.getItem("type")
        switch (type) {
            case 'student':
                group.getGroupByStudentId(userInfo.id).then(resp => {
                    const list = []
                    list.push(resp.data)
                    setGroupList(list)
                }).catch(err => {
                    console.log(err)
                })
                return;
            case 'teacher':
                group.getGroupListByTeacherId(userInfo.id).then(resp => {
                    setGroupList(resp.data)
                }).catch(err => {
                    console.log(err)
                })
                return;
            case 'admin':
                group.getAllGroupList().then(resp => {
                    setGroupList(resp.data)
                }).catch(err => {
                    console.log(err)
                })
                return;
            default:
                setGroupList([])
        }
    }, [])

    return (
        <div className={styles.groupBox}>
            {
                groupList.map(item => <GroupItem key={item.id} {...item} />)
            }
        </div>
    )
}