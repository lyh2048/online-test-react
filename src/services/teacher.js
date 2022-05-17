import request from "../request"

const teacher = {
    async pageTeacher(pageNo, pageSize) {
        return await request.get(
            '/teacher',
            {
                params: {
                    pageNo,
                    pageSize,
                    action: 'pageTeacher'
                }
            }
        )
    },
    async getTeacherById(id) {
        return await request.get(
            '/teacher',
            {
                params: {
                    action: 'showTeacherById',
                    id: id
                }
            }
        )
    }
}

export default teacher