import request from "../request"

const record = {
    async existsRecord(submitStudentId, submitTestId, submitProblemId) {
        return await request.get(
            '/record',
            {
                params: {
                    action: 'existsRecord',
                    submitStudentId,
                    submitTestId,
                    submitProblemId
                }
            }
        )
    },
    async submitRecord(submitStudentId, submitTestId, submitProblemId, submitOption) {
        return await request.get(
            '/record',
            {
                params: {
                    action: 'submitRecord',
                    submitStudentId,
                    submitTestId,
                    submitProblemId,
                    submitOption
                }
            }
        )
    }
}

export default record