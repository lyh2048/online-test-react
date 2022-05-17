import request from "../request"

const problem = {
    async getProblemList(pageNo, pageSize) {
        return await request.get(
            '/problem',
            {
                params: {
                    pageNo,
                    pageSize,
                    action: 'pageProblem'
                }
            }
        )
    },
    async searchProblem(pageNo, pageSize, searchSubjectId, title, searchType) {
        return await request.get(
            '/problem',
            {
                params: {
                    pageNo,
                    pageSize,
                    searchSubjectId,
                    title,
                    searchType,
                    action: 'searchProblem'
                }
            }
        )
    },
    async getAllProblems() {
        return await request.get(
            '/problem',
            {
                params: {
                    action: 'getAllProblems'
                }
            }
        )
    }
}

export default problem