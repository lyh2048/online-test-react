export function isAuth() {
    return localStorage.getItem("token") && localStorage.getItem("type") && localStorage.getItem("userInfo")
}