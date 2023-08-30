import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useKeycloak} from "@react-keycloak/web";
import {LaptopOutlined, UserOutlined} from '@ant-design/icons';
import {Menu} from "antd";
import {LoginOutlined, LogoutOutlined} from "@ant-design/icons/lib/icons";

enum MenuEntry {
    USERS,
    COUNTER,
    LOGIN,
    LOGOUT
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
    readonly label: string
}

const menuItems: MenuItem[] = [
    {
        type: MenuEntry.USERS,
        access: {
            public: false,
            showAfterLogin: true
        },
        key: "users",
        icon: UserOutlined,
        label: "Users"
    },
    {
        type: MenuEntry.COUNTER,
        access: {
            public: false,
            showAfterLogin: true
        },
        key: "counter",
        icon: LaptopOutlined,
        label: "Counter"
    },
    {
        type: MenuEntry.LOGOUT,
        access: {
            public: false,
            showAfterLogin: true
        },
        key: "logout",
        icon: LogoutOutlined,
        label: "Logout"
    },
    {
        type: MenuEntry.LOGIN,
        access: {
            public: true,
            showAfterLogin: false
        },
        key: "login",
        icon: LoginOutlined,
        label: "Login"
    },
]

export const MenuProvider: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>([])
    const {keycloak} = useKeycloak()
    const navigate = useNavigate()

    useEffect(() => {
        const filteredItems = menuItems
            .filter(e => e.access.showAfterLogin === keycloak.authenticated)
        setItems(filteredItems)
    }, []);

    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{height: '100%'}}
            items={items.map((e, index) => {
                    return {
                        key: `${e.key}`,
                        icon: React.createElement(e.icon),
                        label: `${e.label}`
                    }
                },
            )}
            onClick={(selected) => {
                const item = items.find(e => e.key === selected.key)!!
                switch (item.type) {
                    case MenuEntry.LOGOUT:
                        keycloak.logout()
                            .then(r => {
                            })
                        break
                    case MenuEntry.LOGIN:
                        keycloak.login()
                            .then(r => {
                            })
                        break
                    default:
                        const path = `/${selected.key}`
                        navigate(path)
                }

            }}
        />
    )
}