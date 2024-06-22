import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import { HomeOutlined, LaptopOutlined, UserOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons/lib/icons'
import { useTranslation } from 'react-i18next'
import { GlobalSettingsContext } from '@/App'

enum MenuEntry {
  HOME,
  USERS,
  COUNTER,
  LOGIN,
  LOGOUT,
}

type MenuItemAccess = {
  readonly public: boolean
  readonly showAfterLogin: boolean
}

type MenuItem = {
  readonly type: MenuEntry
  readonly access: MenuItemAccess
  readonly key: string
  readonly icon: any
}

const menuItems: MenuItem[] = [
  {
    type: MenuEntry.HOME,
    access: {
      public: true,
      showAfterLogin: true,
    },
    key: 'home',
    icon: HomeOutlined,
  },
  {
    type: MenuEntry.USERS,
    access: {
      public: false,
      showAfterLogin: true,
    },
    key: 'users',
    icon: UserOutlined,
  },
  {
    type: MenuEntry.COUNTER,
    access: {
      public: false,
      showAfterLogin: true,
    },
    key: 'counter',
    icon: LaptopOutlined,
  },
  {
    type: MenuEntry.LOGOUT,
    access: {
      public: false,
      showAfterLogin: true,
    },
    key: 'logout',
    icon: LogoutOutlined,
  },
  {
    type: MenuEntry.LOGIN,
    access: {
      public: true,
      showAfterLogin: false,
    },
    key: 'login',
    icon: LoginOutlined,
  },
]

export const MenuAnt: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([])
  const { keycloak } = useKeycloak()
  const navigate = useNavigate()
  const { t } = useTranslation(['main'])
  const globalSettings = useContext(GlobalSettingsContext)

  useEffect(() => {
    const filteredItems = menuItems.filter((e) => e.access.showAfterLogin === keycloak.authenticated)
    setItems(filteredItems)
  }, [])

  useEffect(() => {
    // ...
  }, [globalSettings])

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      style={{ height: '100%' }}
      items={items.map((e, index) => {
        return {
          key: `${e.key}`,
          icon: React.createElement(e.icon),
          label: `${t(`menu.${e.key}`, { ns: ['main'] })}`,
        }
      })}
      onClick={(selected) => {
        const item = items.find((e) => e.key === selected.key)!!
        switch (item.type) {
          case MenuEntry.HOME:
            navigate('/')
            break
          case MenuEntry.LOGOUT:
            keycloak.logout().then((r) => {})
            break
          case MenuEntry.LOGIN:
            keycloak.login().then((r) => {})
            break
          default:
            const path = `/${selected.key}`
            navigate(path)
        }
      }}
    />
  )
}
