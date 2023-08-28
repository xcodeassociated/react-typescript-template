import React, {useReducer} from "react";
import styled from 'styled-components';
import {Role, User} from "./api/api.types";
import {useRoles} from "./hooks/useRoles";
import {useUsers} from "./hooks/useUsers";
import {notNil} from "./utils/utils";
import type {ColumnsType} from 'antd/es/table';
import {Input, Table, Typography, Button, Select, Col, Divider, Row} from 'antd';


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
            return { ...prevState, ...init, updateMode: false }
        case "INPUT_CANCEL_UPDATE":
            return { ...prevState, ...init, updateMode: false }
        case "VALUE_CHANGE":
            return { ...action.payload }
        case "INPUT_UPDATE":
            return { ...action.payload, updateMode: true }
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
            dispatch({type: "INPUT_RESET"})
        } else {
            showError()
        }
    }

    const handleUserUpdate = async () => {
        if (notNil(userInput.name) && notNil(userInput.role)) {
            await updateUser(userInputToUser(userInput, roles!!))
            dispatch({type: "INPUT_RESET"})
        } else {
            showError()
        }
    }

    const handleDeleteUser = async (id: string) => {
        await deleteUser(id)
    }


    const columns: ColumnsType<User> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: '_id',
            width: '20%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '30%',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            render: (_: any, user: User) => {
                return (
                    user.role.map((role: Role) => role.name)
                )
            }
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_: any, user: User) => {
                return (
                    <span>
                        <Typography.Link onClick={
                        () => dispatch({
                            type: "INPUT_UPDATE",
                            payload: new State(user._id, user.email, user.name, user.role[0]._id, user.version)
                        })}>
                            Update
                        </Typography.Link>
                        <br />
                        <Typography.Link onClick={() => handleDeleteUser(user._id!!)}>
                            Delete
                        </Typography.Link>
                    </span>
                );
            },
        },
    ];

    return (
        <UsersWrapper>
            <div>
                <div>
                    <Divider orientation="left">User Data</Divider>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={2}>
                            <div>
                                Name
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div>
                                <Input type={"text"} name={"name"} value={userInput.name} onChange={
                                    (e) => dispatch({type: "VALUE_CHANGE", payload: {...userInput, name: e.target.value}})
                                } />
                            </div>
                        </Col>
                    </Row>
                    {!userInput.updateMode ?
                        <Row gutter={16}>
                            <Col className="gutter-row" span={2}>
                                <div>
                                    Email
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <div>
                                    <Input type={"email"} name={"email"} value={userInput.email} onChange={
                                        (e) => dispatch({type: "VALUE_CHANGE", payload: {...userInput, email: e.target.value}})
                                    } />
                                </div>
                            </Col>
                        </Row> : null
                    }
                    <Row gutter={16}>
                        <Col className="gutter-row" span={2}>
                            <div>
                                Role
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div>
                                <Select style={{ width: 600 }} value={userInput.role} onChange={
                                    (e) => dispatch({type: "VALUE_CHANGE", payload: {...userInput, role: e}})
                                }>
                                    {roles?.map((role: Role) =>
                                        <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>)
                                    }
                                </Select>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={2}>
                            <Button name={"submit"} type={"primary"} onClick={submitForm}>Submit</Button>
                        </Col>
                        <Col className="gutter-row" span={2}>
                            {userInput.updateMode ?
                                <Button name={"cancelUpdate"} onClick={() => dispatch({type: "INPUT_CANCEL_UPDATE"})}>Cancel</Button>
                                :
                                <Button name={"cancelUpdate"} onClick={() => dispatch({type: "INPUT_RESET"})}>Clear</Button>
                            }
                        </Col>
                    </Row>
                </div>
                <Divider orientation="left">Users Table</Divider>
                <div>
                    <Table
                        bordered
                        dataSource={users}
                        columns={columns}
                        rowClassName="editable-row"
                        />
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