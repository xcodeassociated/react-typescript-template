import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {TRolesResponse, TUsersResponse, User} from "./api.types";
import {UserInput} from "../Users";

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

export async function apiGetUsers<T = TUsersResponse>(token: string): Promise<AxiosResponse<T, any>> {
    return axios.get<T>(API_URL + '/users', makeConfig(token))
}

export async function apiGetRoles<T = TRolesResponse>(token: string): Promise<AxiosResponse<TRolesResponse, any>> {
    return axios.get<TRolesResponse>(API_URL + '/permissions', makeConfig(token))
}

export async function apiPostUser<T = TUsersResponse>(token: string, user: User): Promise<AxiosResponse<T, any>> {
    return axios.post<T>(API_URL + '/users', {name: user.name, email: user.email, role: user.role.map(e => e._id), version: user.version}, makeConfig(token))
}

export async function apiPutUser<T = TUsersResponse>(token: string, user: User): Promise<AxiosResponse<T, any>> {
    return axios.put<T>(API_URL + '/users/' + user._id, {name: user.name, email: user.email, role: user.role.map(e => e._id), version: user.version}, makeConfig(token))
}

export async function apiDeleteUser<T = void>(token: string, id: string): Promise<AxiosResponse<T, any>> {
    return axios.delete<T>(API_URL + '/users/' + id, makeConfig(token))
}