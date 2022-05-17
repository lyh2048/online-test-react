import request from "../request"

const student = {
    async pageStudent(pageNo, pageSize) {
        return await request.get(
            '/student',
            {
                params: {
                    pageNo,
                    pageSize,
                    action: 'pageStudent'
                }
            }
        )
    },
    async getStudentById(id) {
        return await request.get(
            '/student',
            {
                params: {
                    id,
                    action: 'showStudentById'
                }
            }
        )
    }
}

export default student