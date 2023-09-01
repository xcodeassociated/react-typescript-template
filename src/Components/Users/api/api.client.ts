import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {Page, Role, User} from "./api.types";

const API_URL = 'http://localhost:8080/coroutine' // jvm api coroutine
// const API_URL = 'http://localhost:8080/reactive' // jvm api reactive
// const API_URL = 'http://localhost:4500' // node.js api
// const API_URL = 'http://localhost:8082' // jvm api jpa

const makeConfig = (token: string): AxiosRequestConfig => {
    return {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
}

export async function apiGetUsers<T = User[]>(token: string, page: Page = new Page()): Promise<AxiosResponse<T, any>> {
    return axios.get<T>(API_URL + `/users?page=${page.page}&size=${page.pageSize}&sort=${page.sort}&direction=${page.direction}`, makeConfig(token))
}

export async function apiGetUsersSize<T = number>(token: string): Promise<AxiosResponse<T, any>> {
    return axios.get<T>(API_URL + '/usersCount', makeConfig(token))
}

export async function apiGetRoles<T = Role[]>(token: string): Promise<AxiosResponse<T, any>> {
    return axios.get<T>(API_URL + '/permissions', makeConfig(token))
}

export async function apiPostUser<T = User[]>(token: string, user: User): Promise<AxiosResponse<T, any>> {
    return axios.post<T>(API_URL + '/users', {
        name: user.name,
        email: user.email,
        role: user.role.map(e => e._id),
        version: user.version
    }, makeConfig(token))
}

export async function apiPutUser<T = User[]>(token: string, user: User): Promise<AxiosResponse<T, any>> {
    return axios.put<T>(API_URL + '/users/' + user._id, {
        name: user.name,
        email: user.email,
        role: user.role.map(e => e._id),
        version: user.version
    }, makeConfig(token))
}

export async function apiDeleteUser<T = void>(token: string, id: string): Promise<AxiosResponse<T, any>> {
    return axios.delete<T>(API_URL + '/users/' + id, makeConfig(token))
}