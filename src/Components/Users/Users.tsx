import React, {ChangeEvent, useEffect, useState} from "react";
import styled from 'styled-components';
import {Role, User} from "./api/api.types";
import {useRoles} from "./hooks/useRoles";
import {useUsers} from "./hooks/useUsers";
import {notNil, userInputToUser} from "./utils/utils";


export class UserInput {
    _id: string | undefined;
    email: string = "";
    name: string = "";
    role: string = "";

    version: number | undefined;

    constructor(id: string | undefined = undefined,
                email: string = "",
                name: string = "",
                role: string = "",
                version: number | undefined = undefined) {
        this._id = id
        this.email = email;
        this.name = name;
        this.role = role;
        this.version = version;
    }
}

export const Users: React.FC = () => {
    const { roles } = useRoles()
    const { users, createUser, updateUser, deleteUser } = useUsers()

    const [userInput, setUserInput] = useState<UserInput>(new UserInput())
    const [update, setUpdate] = useState<boolean>(false)

    useEffect(() => {
        if (!update) {
            setUserInput(new UserInput())
        }
    }, [update])

    const showFormIncorrect = () => alert('form not complete')

    const submitForm = () => update ? handleUserUpdate() : handleUserCreate()

    const handleUserCreate = async () => {
        if (notNil(userInput.name) && notNil(userInput.email) && notNil(userInput.role)) {
            await createUser(userInputToUser(userInput, roles!!))
        } else {
            showFormIncorrect()
        }
    }

    const handleUserUpdate = async () => {
        if (notNil(userInput.name) && notNil(userInput.role)) {
            await updateUser(userInputToUser(userInput, roles!!))
        } else {
            showFormIncorrect()
        }
    }

    const handleDeleteUser = async (id: string) => {
        await deleteUser(id)
    }

    const handleUpdate = (user: User) => {
        setUpdate(true);
        setUserInput(new UserInput(user._id, user.email, user.name, user.role[0]._id, user.version))
    }

    const cancelUpdate = () => setUpdate(false)

    const clearUserInput = () => setUserInput(new UserInput())

    return (
        <>
            <UsersWrapper>
                <div>
                    <div>
                        users page
                    </div>
                    <br />
                    <div>
                        <span>
                            name: <input type={"text"} name={"name"} value={userInput.name} onChange={
                                (e) => setUserInput({...userInput, name: e.target.value})
                            } />
                        </span>
                        {!update ?
                            <>
                                <span>
                                    email: <input type={"email"} name={"email"} value={userInput.email} onChange={
                                    (e) => setUserInput({...userInput, email: e.target.value})
                                } />
                                </span>
                            </> : null
                        }
                        <span>
                            role: <select name={"role"} value={userInput.role} onChange={
                                (e) => setUserInput({...userInput, role: e.target.value})
                            }>
                                {roles?.map((role: Role) =>
                                    <option key={role._id} value={role._id}>{role.name}</option>)
                                }
                            </select>
                        </span>
                        <span>
                            <button name={"submit"} type={"submit"} onClick={submitForm}>submit</button>
                        </span>
                        {update ?
                            <>
                                <button name={"cancelUpdate"} onClick={cancelUpdate}>cancel update</button>
                            </> :
                            <>
                                <button name={"cancelUpdate"} onClick={clearUserInput}>clear</button>
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
                                                <button name={"submit"} type={"submit"} onClick={() => handleUpdate(user)}>update</button>
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
        </>
    )
}

const UsersWrapper = styled.div`
  font-size: 32px;
  @media (max-width: 800px) {
  }
`;
