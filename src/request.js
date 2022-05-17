import axios from "axios"
import {message} from "antd"

const request = axios.create({
    baseURL: '/api/v1',
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem("token") ? localStorage.getItem("token") : ''
    }
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
})


// 添加响应拦截器
request.interceptors.response.use(async function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const data = response.data
    if (data.code !== 0) {
        if (data.code === 40003) {
            // 权限不足，重新登录
            message.error('登录失效，请重新登录')
            window.location.href = "#/login"
        }
    }
    return data;
}, async function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    message.error('获取数据失败')
    return Promise.reject(error);
})

export default request