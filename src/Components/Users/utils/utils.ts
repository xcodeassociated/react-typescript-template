import {Role, User} from "../api/api.types";
import {UserInput} from "../Users";

export const notNil = (input: string | undefined) => (input?.trim()?.length || 0) > 0;

export const userInputToUser = (input: UserInput, roles: Role[]): User => {
    return {
        _id: input._id,
        email: input.email,
        name: input.name,
        role: roles.filter(e => e._id === input.role),
        version: input.version,
        createdBy: undefined,
        createdDate: undefined,
        modifiedBy: undefined,
        modifiedDate: undefined
    }
}