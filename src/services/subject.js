import request from "../request"

const subject = {
    async getAllSubjects() {
        return await request.get(
            '/subject',
            {
                params: {
                    action: 'getAllSubjects'
                }
            }
        )
    },
    async pageSubject(pageNo, pageSize) {
        return await request.get(
            '/subject',
            {
                params: {
                    pageNo,
                    pageSize,
                    action: 'pageSubject'
                }
            }
        )
    }
}

export default subject