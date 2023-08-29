import React, {useReducer} from "react";
import styled from 'styled-components';
import {Role, User} from "./api/api.types";
import {useRoles} from "./hooks/useRoles";
import {useUsers} from "./hooks/useUsers";
import type {ColumnsType} from 'antd/es/table';
import {Input, Table, Typography, Button, Select, Col, Divider, Row, Form} from 'antd';


class State {
    page: number = 1
    pageSize: number = 10

    constructor(page: number = 1, pageSize: number = 10) {
        this.page = page
        this.pageSize = pageSize
    }
}

type Action =
    | {type: "PAGINATION_CHANGED", payload: State}

function reducer(prevState: State = new State(), action: Action): State {
    switch (action.type) {
        case "PAGINATION_CHANGED":
            console.log(`reducer: PAGINATION_CHANGED with: ${JSON.stringify(action.payload)}`)
            return { ...prevState, ...action.payload }
    }
}

export const Users: React.FC = () => {
    const { roles } = useRoles()
    const { users, createUser, updateUser, deleteUser } = useUsers()
    const [state, dispatch] = useReducer(reducer, new State())
    const [form] = Form.useForm();
    const id = Form.useWatch("_id", form)

    const handleDeleteUser = async (id: string) => {
        await deleteUser(id)
    }

    const { Option } = Select;

    const layout = {
        labelCol: { span: 2 },
        wrapperCol: { span: 16 },
    };

    const tailLayout = {
        wrapperCol: { offset: 2, span: 16 },
    };

    const onFinish = async (values: any) => {
        console.log(values);
        if (!values._id) {
            await createUser(userInputToUser(values, roles!!))
            form.resetFields();
        } else {
            await updateUser(userInputToUser(values, roles!!))
            form.resetFields();
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    const updateFormValues = (user: User) => {
        form.setFieldsValue({ name: user.name, email: user.email, role: user.role[0]._id, _id: user._id, version: user.version });
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
                        <Typography.Link onClick={() => updateFormValues(user)}>
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
            <Divider orientation="left">User Data</Divider>
            <Form
                {...layout}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
            >
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input disabled={!!id} />
                </Form.Item>
                <Form.Item name="_id" label="ID" noStyle>
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item name="version" label="Version" noStyle>
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                    <Select
                        placeholder="Select a role"
                        allowClear
                    >
                        {roles?.map((role: Role) =>
                            <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <span>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                    </span>
                </Form.Item>
            </Form>
            <Divider orientation="left">Users Table</Divider>
                <Table
                    bordered
                    dataSource={users}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '30'],
                        onChange: (page: number, pageSize: number) => {
                            dispatch({type: "PAGINATION_CHANGED", payload: new State(page, pageSize)})
                        }
                }}
                    />
        </UsersWrapper>
    )
}

const UsersWrapper = styled.div`
  font-size: 32px;
  @media (max-width: 800px) {
  }
`;

const userInputToUser = (values: any, roles: Role[]): User => {
    return {
        _id: values._id,
        email: values.email,
        name: values.name,
        role: roles.filter(e => e._id === values.role),
        version: values.version,
        createdBy: undefined,
        createdDate: undefined,
        modifiedBy: undefined,
        modifiedDate: undefined
    }
}