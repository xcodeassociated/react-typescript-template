import {useEffect, useState} from "react";
import {Role} from "../api/api.types";
import {apiGetRoles} from "../api/api.client";
import keycloak from "../../../Keycloak/keycloak";


export const useRoles = () => {
    const [roles, setRoles] = useState<Role[]>()
    useEffect(() => {
        if (!roles) {
            getRoles()
                .catch(error => console.error(error))
        }
    }, []);

    const getRoles = async () => {
        const response = await apiGetRoles(keycloak.token!!)
        if (response.status === 200){
            const fetched = response.data
            setRoles([...fetched])
        } else {
            console.error(response)
        }
    }

    return {
        roles,
        updateRoles: () => {
            getRoles()
                .catch(error => console.error(error))
        }
    }
}