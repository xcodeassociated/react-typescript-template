import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {RolesResponseT, UsersResponseT} from "./api.types";
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

export async function apiGetUsers<T = UsersResponseT>(token: string): Promise<AxiosResponse<T, any>> {
    return axios.get<T>(API_URL + '/users', makeConfig(token))
}

export async function apiGetRoles<T = RolesResponseT>(token: string): Promise<AxiosResponse<RolesResponseT, any>> {
    return axios.get<RolesResponseT>(API_URL + '/permissions', makeConfig(token))
}

export async function apiPostUser<T = UsersResponseT>(token: string, userInput: UserInput): Promise<AxiosResponse<T, any>> {
    return axios.post<T>(API_URL + '/users', userInput, makeConfig(token))
}

export async function apiPutUser<T = UsersResponseT>(token: string, id: string, name: string, email: string, role: string, version: number | undefined): Promise<AxiosResponse<T, any>> {
    return axios.put<T>(API_URL + '/users/' + id, {name: name, email: email, role: role, version: version}, makeConfig(token))
}

export async function apiDeleteUser<T = void>(token: string, id: string): Promise<AxiosResponse<T, any>> {
    return axios.delete<T>(API_URL + '/users/' + id, makeConfig(token))
}