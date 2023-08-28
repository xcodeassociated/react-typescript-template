import {useEffect, useState} from "react";
import {User} from "../api/api.types";
import {apiDeleteUser, apiGetUsers, apiPostUser, apiPutUser} from "../api/api.client";
import keycloak from "../../../Keycloak/keycloak";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>()

    useEffect(() => {
        if (!users) {
            getUsers()
                .catch(error => console.error(error))
        }
    }, []);

    const getUsers = async () => {
        const response = await apiGetUsers(keycloak.token!!)
        if (response.status === 200) {
            setUsers([...response.data])
        } else {
            console.error(response)
        }
    }

    const createUser = async (user: User) => {
        const response = await apiPostUser(keycloak.token!!, user)
        if (response.status === 201 || response.status === 200) {
            await getUsers()
        } else {
            console.error(response)
        }
    }

    const updateUser = async (user: User) => {
        const response = await apiPutUser(keycloak.token!!, user)
        if (response.status === 200) {
            await getUsers()
        } else {
            console.error(response)
        }
    }

    const deleteUser = async (id: string) => {
        const response = await apiDeleteUser(keycloak.token!!, id)
        if (response.status === 200) {
            await getUsers()
        } else {
            console.error(response)
        }
    }

    return {
        users,
        createUser,
        updateUser,
        deleteUser
    }
}