export type RoleT = {
    readonly _id: string,
    name: string,
    description: string

    version: number | undefined;
    createdBy: string | undefined;
    createdDate: string | undefined;
    modifiedBy: string | undefined;
    modifiedDate: string | undefined;
}

export type RolesResponseT = RoleT[]

export type UserT = {
    readonly _id: string;
    name: string;
    email: string;
    role: RoleT[];

    version: number | undefined;
    createdBy: string | undefined;
    createdDate: string | undefined;
    modifiedBy: string | undefined;
    modifiedDate: string | undefined;
}

export type UsersResponseT = UserT[]

export type UserUpdateT = {
    name: string;
    role: string;
}

