import request from "../request"

const group = {
    async pageGroup(pageNo, pageSize) {
        return await request.get(
            '/class',
            {
                params: {
                    pageNo,
                    pageSize,
                    action: 'pageClass'
                }
            }
        )
    },
    async getAllGroupList() {
        return await request.get(
            '/class',
            {
                params: {
                    action: 'showClassList'
                }
            }
        )
    },
    async getGroupListByTeacherId(id) {
        return await request.get(
            '/class',
            {
                params: {
                    action: 'showClassListByTeacherId',
                    teacherId: id
                }
            }
        )
    },
    async getGroupByStudentId(id) {
        return await request.get(
            '/class',
            {
                params: {
                    action: 'showClassListByStudentId',
                    studentId: id
                }
            }
        )
    },
    async getGroupByGroupId(id) {
        return await request.get(
            '/class',
            {
                params: {
                    action: 'showClassById',
                    id: id
                }
            }
        )
    },
    async getGroupInfo(id) {
        return await request.get(
            '/class',
            {
                params: {
                    action: 'showClassDetails',
                    classId: id
                }
            }
        )
    }
}

export default group