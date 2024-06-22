import React, { useContext, useReducer } from 'react'
import { Page, Role, User } from './api/usersApi.types'
import type { ColumnsType } from 'antd/es/table'
import { Button, Divider, Form, Input, Select, Space, Table, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { GlobalSettingsContext } from '@/App'
import { useRolesGraphql } from './hooks/useRolesGraphql'
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useGetUsersSizeQuery,
  useUpdateUserMutation,
} from './api/usersApi'
import { PayloadAction } from '@reduxjs/toolkit'

const { Option } = Select

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 16 },
}

const tailLayout = {
  wrapperCol: { offset: 2, span: 16 },
}

type Action = { type: 'PAGINATION_CHANGED'; payload: Page }

function pageReducer(prevState: Page = new Page(), action: Action): Page {
  switch (action.type) {
    case 'PAGINATION_CHANGED':
      return { ...prevState, ...action.payload }
  }
}

const userInputToUser = (values: any, roles: Role[]): User => {
  return {
    _id: values._id,
    email: values.email,
    name: values.name,
    role: roles.filter((e) => e._id === values.role),
    version: values.version,
    createdBy: undefined,
    createdDate: undefined,
    modifiedBy: undefined,
    modifiedDate: undefined,
  }
}

const toPayload = (data: Page): PayloadAction<{ page: number; pageSize: number; sort: string; direction: string }> => {
  return { payload: { page: data.page, pageSize: data.pageSize, sort: data.sort, direction: data.direction }, type: '' }
}

export const Users: React.FC = () => {
  const [page, dispatch] = useReducer(pageReducer, new Page())
  const { roles } = useRolesGraphql()
  const users = useGetAllUsersQuery(toPayload(page))
  const size = useGetUsersSizeQuery()
  const [createUser] = useCreateUserMutation()
  const [updateUser] = useUpdateUserMutation()
  const [deleteUser] = useDeleteUserMutation()
  const [form] = Form.useForm()
  const id = Form.useWatch('_id', form)
  const { t } = useTranslation(['main'])
  const globalSettings = useContext(GlobalSettingsContext)

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id)
  }

  const onFinish = async (values: any) => {
    if (!values._id) {
      await createUser(userInputToUser(values, roles!!))
      form.resetFields()
    } else {
      await updateUser(userInputToUser(values, roles!!))
      form.resetFields()
    }
  }

  const onReset = () => {
    form.resetFields()
  }

  const updateFormValues = (user: User) => {
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role[0]._id,
      _id: user._id,
      version: user.version,
    })
  }

  const columns: ColumnsType<User> = [
    {
      title: `${t(`users.name`, { ns: ['main'] })}`,
      dataIndex: 'name',
      key: '_id',
      width: '20%',
    },
    {
      title: `${t(`users.email`, { ns: ['main'] })}`,
      dataIndex: 'email',
      width: '30%',
    },
    {
      title: `${t(`users.role`, { ns: ['main'] })}`,
      dataIndex: 'users.role',
      render: (_: any, user: User) => {
        return user.role.map((role: Role) => role.name)
      },
    },
    {
      title: 'users.actions',
      dataIndex: 'operation',
      render: (_: any, user: User) => {
        return (
          <span>
            <Typography.Link onClick={() => updateFormValues(user)}>
              {t(`users.update`, { ns: ['main'] })}
            </Typography.Link>
            <br />
            <Typography.Link onClick={() => handleDeleteUser(user._id!!)}>
              {t(`users.delete`, { ns: ['main'] })}
            </Typography.Link>
          </span>
        )
      },
    },
  ]

  if (users.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Divider orientation="left">{`${t(`users.t1`, { ns: ['main'] })}`}</Divider>
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="name" label={`${t(`users.name`, { ns: ['main'] })}`} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label={`${t(`users.email`, { ns: ['main'] })}`} rules={[{ required: true }]}>
          <Input disabled={!!id} />
        </Form.Item>
        <Form.Item name="_id" label="ID" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="version" label="Version" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="role" label={`${t(`users.role`, { ns: ['main'] })}`} rules={[{ required: true }]}>
          <Select placeholder="Select a role" allowClear>
            {roles?.map((role: Role) => (
              <Option key={role._id} value={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space size={'small'}>
            <Button type="primary" htmlType="submit">
              {`${t(`users.submit`, { ns: ['main'] })}`}
            </Button>
            <Button htmlType="button" onClick={onReset}>
              {`${t(`users.reset`, { ns: ['main'] })}`}
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider orientation="left">{`${t(`users.t2`, { ns: ['main'] })}`}</Divider>
      <Table
        bordered
        dataSource={users.data?.map((e) => {
          return { ...e, key: e._id }
        })}
        columns={columns.map((column) => {
          return { ...column, title: `${t('column.title', { ns: ['main'] })}` }
        })}
        rowClassName="editable-row"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '100'],
          total: size.data,
          onChange: (page: number, pageSize: number) => {
            const pageIndex = page - 1
            dispatch({ type: 'PAGINATION_CHANGED', payload: new Page(pageIndex, pageSize) })
          },
        }}
      />
    </>
  )
}

