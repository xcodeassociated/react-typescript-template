export type RoleT = {
    _id: string,
    name: string,
    description: string
}

export type RolesResponseT = RoleT[]

export type UserT = {
    _id: string;
    name: string;
    email: string;
    role: RoleT[];
}

export type UsersResponseT = UserT[]

export type UserUpdateT = {
    name: string;
    role: string;
}

