import request from "../request"

const test = {
    async getContestDetail(testId) {
        return request.get(
            '/test',
            {
                params: {
                    action: 'showTestDetails',
                    testId
                }
            }
        )
    },
    async createTest(classId, testName, testStartTime, testLength, addProblemId) {
        return request.get(
            '/test',
            {
                params: {
                    action: 'addNewContest',
                    classId,
                    testName,
                    testStartTime,
                    testLength,
                    addProblemId: addProblemId.toString()
                }
            }
        )
    }
}

export default test