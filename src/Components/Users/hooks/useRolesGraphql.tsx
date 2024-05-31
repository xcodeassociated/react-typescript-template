import {useEffect, useState} from "react";
import {Role} from "../api/api.types";
import {gql, useQuery} from '@apollo/client';


export const ROLE_QUERY = gql`
    query getAllPermissions($page: Int, $size: Int, $sort:String, $direction: String) {
        getAllPermissions(page: $page, size: $size, sort: $sort, direction: $direction) {
            id,
            name
        }
    }
`

interface RoleDto {
    readonly id: string,
    name: string
}

export const useRolesGraphql = () => {
    const [roles, setRoles] = useState<Role[]>()
    const {loading, error, data} = useQuery(ROLE_QUERY, {
        variables: {
            page: 0,
            size: 10,
            sort: "id",
            direction: "ASC"
        }
    })

    useEffect(() => {
        if (!roles) {
            getRoles()
        }
    }, [data, loading, error])

    const getRoles = () => {
        if (error) {
            console.error(`apollo error: ` + error.message)
        }

        if (loading) {
            console.debug("apollo: waiting for data...")
        }

        if (data) {
            const permissions: Role[] = data.getAllPermissions.map((e: RoleDto) => {
                return {
                    _id: e.id,
                    name: e.name
                } as Role
            })
            setRoles([...permissions])
        }
    }

    return {
        roles
    }
}