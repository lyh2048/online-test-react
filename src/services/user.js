import request from "../request";

const user = {
    async login(username, password, type) {
        switch (type) {
            case 'admin':
                return await request.get(
                    '/admin',
                    {params: {username, password, action: 'loginAdmin'}}
                )
            case 'student':
                return await request.get(
                    '/student',
                    {params: {username, password, action: 'loginStudent'}}
                )
            default:
                return await request.get(
                    '/teacher',
                    {params: {username, password, action: 'loginTeacher'}}
                )
        }
    },

    async register(username, password, email, code, type) {
        switch (type) {
            case 'student':
                return await request.get(
                    '/student',
                    {params: {
                        username, password, email, code, action: 'registStudent'
                        }}
                )
            default:
                return await request.get(
                    '/teacher',
                    {params: {
                        username, password, email, code, action: 'registTeacher'
                        }}
                )
        }
    },

    async logout() {
      return await request.get(
          '/admin',
          {
              params: {
                  action: 'logout'
          }}
      )
    }
}

export default user