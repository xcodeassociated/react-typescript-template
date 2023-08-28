export interface Role {
    readonly _id: string | undefined,
    name: string,
    description: string

    version: number | undefined;
    createdBy: string | undefined;
    createdDate: string | undefined;
    modifiedBy: string | undefined;
    modifiedDate: string | undefined;
}

export interface User {
    readonly _id: string | undefined;
    name: string;
    email: string;
    role: Role[];

    version: number | undefined;
    createdBy: string | undefined;
    createdDate: string | undefined;
    modifiedBy: string | undefined;
    modifiedDate: string | undefined;
}

