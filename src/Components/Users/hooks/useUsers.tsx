import {useEffect, useState} from "react";
import {Page, User} from "../api/api.types";
import {apiDeleteUser, apiGetUsers, apiGetUsersSize, apiPostUser, apiPutUser} from "../api/api.client";
import keycloak from "../../../Keycloak/keycloak";

export const useUsers = (page: Page) => {
    const [users, setUsers] = useState<User[]>()

    useEffect(() => {
        if (!users) {
            getUsers(page)
                .catch(error => console.error(error))
        }
    }, [])

    useEffect(() => {
        getUsers(page)
            .catch(error => console.error(error))
    }, [page])

    const getUsers = async (page: Page) => {
        const response = await apiGetUsers(keycloak.token!!, page)
        if (response.status === 200) {
            setUsers([...response.data])
        } else {
            console.error(response)
        }
    }

    const getUsersSize = async () => {
        const response = await apiGetUsersSize(keycloak.token!!)
        if (response.status === 200) {
            return response.data
        } else {
            console.error(response)
            throw Error("Could not get users size")
        }
    }

    const createUser = async (user: User) => {
        const response = await apiPostUser(keycloak.token!!, user)
        if (response.status === 201 || response.status === 200) {
            await getUsers(page)
        } else {
            console.error(response)
        }
    }

    const updateUser = async (user: User) => {
        const response = await apiPutUser(keycloak.token!!, user)
        if (response.status === 200) {
            await getUsers(page)
        } else {
            console.error(response)
        }
    }

    const deleteUser = async (id: string) => {
        const response = await apiDeleteUser(keycloak.token!!, id)
        if (response.status === 200) {
            await getUsers(page)
        } else {
            console.error(response)
        }
    }

    return {
        users,
        createUser,
        updateUser,
        deleteUser,
        getUsersSize
    }
}