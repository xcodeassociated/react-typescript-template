import {useEffect, useState} from "react";
import {TUser} from "../api/api.types";
import {apiGetUsers} from "../api/api.client";
import keycloak from "../../../Keycloak/keycloak";

export const useUsers = () => {
    const [users, setUsers] = useState<TUser[]>()

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

    return {
        users,
        updateUsers: () => {
            getUsers()
                .catch(error => console.error(error))
        }
    }
}