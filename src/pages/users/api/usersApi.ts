import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { User, UserInput } from './usersApi.types'
import keycloak from '@/lib/keycloak'
import { PayloadAction } from '@reduxjs/toolkit'

export const usersApi = createApi({
  tagTypes: ['users', 'usersCount'],
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
    getAllUsers: builder.query<
      User[],
      PayloadAction<{
        page: number
        pageSize: number
        sort: string
        direction: string
      }>
    >({
      query: (arg) =>
        `/users?page=${arg.payload.page}&size=${arg.payload.pageSize}&sort=${arg.payload.sort}&direction=${arg.payload.direction}`,
      providesTags: ['users'],
    }),
    getUsersSize: builder.query<number, void>({
      query: () => `/usersCount`,
      providesTags: ['usersCount'],
    }),
    createUser: builder.mutation({
      query: (data: UserInput) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['users', 'usersCount'],
    }),
    updateUser: builder.mutation({
      query: (data: UserInput) => ({
        url: `/users/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['users', 'usersCount'],
    }),
    deleteUser: builder.mutation({
      query: (data: string) => ({
        url: `/users/${data}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['users', 'usersCount'],
    }),
  }),
})

export const {
  useGetAllUsersQuery,
  useGetUsersSizeQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi
