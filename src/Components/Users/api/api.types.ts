export type TRole = {
    readonly _id: string,
    name: string,
    description: string

    version: number | undefined;
    createdBy: string | undefined;
    createdDate: string | undefined;
    modifiedBy: string | undefined;
    modifiedDate: string | undefined;
}

export type RolesResponseT = TRole[]

export type TUser = {
    readonly _id: string;
    name: string;
    email: string;
    role: TRole[];

    version: number | undefined;
    createdBy: string | undefined;
    createdDate: string | undefined;
    modifiedBy: string | undefined;
    modifiedDate: string | undefined;
}

export type UsersResponseT = TUser[]

