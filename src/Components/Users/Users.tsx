import React, {ChangeEvent, useEffect, useMemo, useReducer, useState} from "react";
import styled from 'styled-components';
import {Role, User} from "./api/api.types";
import {useRoles} from "./hooks/useRoles";
import {useUsers} from "./hooks/useUsers";
import {notNil} from "./utils/utils";


class State {
    _id: string | undefined;
    email: string = "";
    name: string = "";
    role: string = "";
    version: number | undefined;
    updateMode: boolean = false;

    constructor(id: string | undefined = undefined,
                email: string = "",
                name: string = "",
                role: string = "",
                version: number | undefined = undefined,
                update: boolean = false) {
        this._id = id
        this.email = email;
        this.name = name;
        this.role = role;
        this.version = version;
        this.updateMode = update
    }
}

type Action =
    | {type: "INPUT_RESET"}
    | {type: "INPUT_CANCEL_UPDATE"}
    | {type: "VALUE_CHANGE", payload: State}
    | {type: "INPUT_UPDATE", payload: State}

function reducer(prevState: State = new State(), action: Action): State {
    const init = new State()
    switch (action.type) {
        case "INPUT_RESET":
            return { ...prevState, ...init }
        case "INPUT_CANCEL_UPDATE":
            return { ...prevState, ...init, updateMode: false }
        case "VALUE_CHANGE":
            return { ...action.payload }
        case "INPUT_UPDATE":
            return { ...prevState, ...action.payload, updateMode: true }
    }
}

export const Users: React.FC = () => {
    const { roles } = useRoles()
    const { users, createUser, updateUser, deleteUser } = useUsers()
    const [userInput, dispatch] = useReducer(reducer, new State())

    const showError = () => {
        alert('form not complete')
    }

    const submitForm = () => userInput.updateMode ? handleUserUpdate() : handleUserCreate()

    const handleUserCreate = async () => {
        if (notNil(userInput.name) && notNil(userInput.email) && notNil(userInput.role)) {
            await createUser(userInputToUser(userInput, roles!!))
        } else {
            showError()
        }
    }

    const handleUserUpdate = async () => {
        if (notNil(userInput.name) && notNil(userInput.role)) {
            await updateUser(userInputToUser(userInput, roles!!))
        } else {
            showError()
        }
    }

    const handleDeleteUser = async (id: string) => {
        await deleteUser(id)
    }

    return (
        <UsersWrapper>
            <div>
                <div>
                    users page
                </div>
                <br />
                <div>
                    <span>
                        name: <input type={"text"} name={"name"} value={userInput.name} onChange={
                            (e) => dispatch({type: "VALUE_CHANGE", payload: {...userInput, name: e.target.value}})
                        } />
                    </span>
                    {!userInput.updateMode ?
                        <>
                            <span>
                                email: <input type={"email"} name={"email"} value={userInput.email} onChange={
                                (e) => dispatch({type: "VALUE_CHANGE", payload: {...userInput, email: e.target.value}})
                            } />
                            </span>
                        </> : null
                    }
                    <span>
                        role: <select name={"role"} value={userInput.role} onChange={
                            (e) => dispatch({type: "VALUE_CHANGE", payload: {...userInput, role: e.target.value}})
                        }>
                            {roles?.map((role: Role) =>
                                <option key={role._id} value={role._id}>{role.name}</option>)
                            }
                        </select>
                    </span>
                    <span>
                        <button name={"submit"} type={"submit"} onClick={submitForm}>submit</button>
                    </span>
                    {userInput.updateMode ?
                        <>
                            <button name={"cancelUpdate"} onClick={() => dispatch({type: "INPUT_CANCEL_UPDATE"})}>cancel update</button>
                        </> :
                        <>
                            <button name={"cancelUpdate"} onClick={() => dispatch({type: "INPUT_RESET"})}>clear</button>
                        </>
                    }
                </div>
                <br />
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                            {users?.map(user => (
                                <tr key={user._id}>
                                    <td><span>{user.name}</span></td>
                                    <td><span>{user.email}</span></td>
                                    <td><span>{user.role.map((role: Role) => role.name)}</span></td>
                                    <td>
                                        <span>
                                            <button name={"submit"} type={"submit"} onClick={
                                                () => dispatch({
                                                    type: "INPUT_UPDATE",
                                                    payload: new State(user._id, user.email, user.name, user.role[0]._id, user.version)
                                                })}>update</button>
                                        </span>
                                        <span>
                                            <button name={"delete"} onClick={() => handleDeleteUser(user._id!!)}>delete</button>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </UsersWrapper>
    )
}

const UsersWrapper = styled.div`
  font-size: 32px;
  @media (max-width: 800px) {
  }
`;

const userInputToUser = (input: State, roles: Role[]): User => {
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