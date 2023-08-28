import React, {ChangeEvent, useEffect, useState} from "react";
import styled from 'styled-components';
import {TRole, TUser} from "./api/api.types";
import {apiDeleteUser, apiGetRoles, apiGetUsers, apiPostUser, apiPutUser} from "./api/api.client";
import keycloak from "../../Keycloak/keycloak";


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

const notNil = (input: string | undefined) => (input?.trim()?.length || 0) > 0;

interface IUsersProps {}

export const Users: React.FC<IUsersProps> = () => {
    const [users, setUsers] = useState<TUser[]>()
    const [roles, setRoles] = useState<TRole[]>()

    const [userInput, setUserInput] = useState<UserInput>(new UserInput())
    const [update, setUpdate] = useState<boolean>(false)

    useEffect(() => {
        if (!roles) {
            getRoles()
                .catch(error => console.error(error))
        }
        if (!users) {
            getUsers()
                .catch(error => console.error(error))
        }
    })

    useEffect(() => {
        if (!update) {
            setUserInput(new UserInput())
        }
    }, [update])

    const getUsers = async () => {
        const response = await apiGetUsers(keycloak.token!!)
        if (response.status === 200) {
            setUsers([...response.data])
        } else {
            console.error(response)
            alert('cannot get users form api')
        }
    }

    const getRoles = async () => {
        const response = await apiGetRoles(keycloak.token!!)
        if (response.status === 200){
            const fetched = response.data
            setRoles([...fetched])

            let role = fetched?.at(0)?._id
            setUserInput({...userInput, role: role ? role : ""})
        } else {
            console.error(response)
            alert('cannot get roles form api')
        }
    }

    const handleNameChane = (e: ChangeEvent<HTMLInputElement>) =>
        setUserInput({...userInput, name: e.target.value})

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
        setUserInput({...userInput, email: e.target.value})

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setUserInput({...userInput, role: e.target.value})

    const showFormIncorrect = () => alert('form not complete')

    const submitForm = () => update ? handleUserUpdate() : handleUserCreate()

    const handleUserCreate = async () => {
        if (notNil(userInput.name) && notNil(userInput.email) && notNil(userInput.role)) {
            const response = await apiPostUser(keycloak.token!!, userInput)
            if (response.status === 201 || response.status === 200) {
                getUsers()
                    .then(() => clearUserInput())
                    .catch(error => console.error(error))
            } else {
                console.error(response)
                alert('cannot create the user')
            }
        } else {
            showFormIncorrect()
        }
    }

    const handleUserUpdate = async () => {
        if (notNil(userInput.name) && notNil(userInput.role)) {
            const response = await apiPutUser(keycloak.token!!, userInput._id!!, userInput.name, userInput.email, userInput.role, userInput.version)
            if (response.status === 200) {
                getUsers()
                    .then(() => cancelUpdate())
                    .catch(error => console.error(error))
            } else {
                console.error(response)
                alert('cannot update the user')
            }
        } else {
            showFormIncorrect()
        }
    }

    const deleteUser = async (id: string) => {
        const response = await apiDeleteUser(keycloak.token!!, id)
        if (response.status === 200) {
            getUsers()
                .catch(error => console.error(error))
        } else {
            console.error(response)
            alert('cannot delete the user')
        }
    }

    const handleUpdate = (user: TUser) => {
        setUpdate(true);
        setUserInput(new UserInput(user._id, user.email, user.name, user.role[0]._id, user.version)) // todo: fix limitation of user role to 1
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
                            name: <input type={"text"} name={"name"} value={userInput.name} onChange={handleNameChane} />
                        </span>
                        {!update ?
                            <>
                                <span>
                                    email: <input type={"email"} name={"email"} value={userInput.email} onChange={handleEmailChange} />
                                </span>
                            </> : null
                        }
                        <span>
                            role: <select name={"role"} value={userInput.role} onChange={handleSelectChange}>
                                {roles?.map((role: TRole) =>
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
                                        <td><span>{user.role.map((role: TRole) => role.name)}</span></td>
                                        <td>
                                            <span>
                                                <button name={"submit"} type={"submit"} onClick={() => handleUpdate(user)}>update</button>
                                            </span>
                                            <span>
                                                <button name={"delete"} onClick={() => deleteUser(user._id)}>delete</button>
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
