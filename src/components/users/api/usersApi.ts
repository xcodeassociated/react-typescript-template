import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {User} from "./usersApi.types"
import keycloak from "../../../keycloak/keycloak"
import {PayloadAction} from "@reduxjs/toolkit"

const parse = (data: User) => {
    return {
        name: data.name,
        email: data.email,
        role: data.role.map(e => e._id),
        version: data.version
    }
}

export const usersApi = createApi({
    tagTypes: ['users'],
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/coroutine',
        prepareHeaders: (headers, { getState }) => {
            const token = keycloak.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: (builder) => ({
        getAllUsers: builder.query<User[], PayloadAction<{page: number, pageSize: number, sort: string, direction: string}>>({
            query: (arg) =>
                `/users?page=${arg.payload.page}&size=${arg.payload.pageSize}&sort=${arg.payload.sort}&direction=${arg.payload.direction}`,
            providesTags: ['users'],
        }),
        getUsersSize: builder.query<number, void>({
            query: () => `/usersCount`,
            // providesTags: ['users'],
        }),
        createUser: builder.mutation({
            query: (data: User) => ({
                url: '/users',
                method: 'POST',
                body: parse(data),
            }),
            invalidatesTags: ['users'],
        }),
        updateUser: builder.mutation({
            query: (data: User) => ({
                url: `/users/${data._id}`,
                method: 'PUT',
                body: parse(data)
            }),
            invalidatesTags: ['users'],
        }),
        deleteUser: builder.mutation({
            query: (data: string) => ({
                url: `/users/${data}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['users'],
        }),
    }),
})

export const {
    useGetAllUsersQuery,
    useGetUsersSizeQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApi