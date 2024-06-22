import React, {createContext, useState} from "react"
import {Counter} from "./pages/counter/Counter"
import {useKeycloak} from "@react-keycloak/web"
import {Navigate, Route, Routes} from "react-router-dom"
import {Home} from "./pages/home/Home"
import {Error, Unauthorized} from "./pages/error/Error"
import {MenuAnt} from "./components/MenuAnt"
import {Users} from "./pages/users/Users"
import {Button, ConfigProvider, Layout, Space, Switch, theme} from "antd"
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons'
import {LanguageSelector} from "./components/LanguageSelector"
import {useTranslation} from "react-i18next"


const {Header, Content, Footer, Sider} = Layout

// @ts-ignore
const ProtectedRoute = ({predicate, redirectPath = '/', children}) => {
    if (!predicate) {
        return <Navigate to={redirectPath} replace/>
    }
    return children
}

export type ThemeColor = {
    isDark: boolean
}

export type GlobalSettings = {
    theme: ThemeColor
}
const defaultTheme: ThemeColor = {isDark: false}
const defaultGlobalSettings: GlobalSettings = {theme: defaultTheme}
export const GlobalSettingsContext = createContext<GlobalSettings>(defaultGlobalSettings)

const App: React.FC = () => {
    const {initialized, keycloak} = useKeycloak()
    const [collapsed, setCollapsed] = useState(false)
    const {token: {colorBgContainer}} = theme.useToken()
    const {defaultAlgorithm, darkAlgorithm} = theme
    const {t} = useTranslation(['main'])
    const [darkMode, setDarkMode] = useState<boolean>(false)

    if (!initialized) {
        return <div>Loading...</div>
    }

    const changeTheme = (value: boolean) => {
        setDarkMode(value)
    }

    return (
        <div className="App">
            <GlobalSettingsContext.Provider value={{theme: {isDark: darkMode}}}>
                <ConfigProvider
                    theme={{
                        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
                    }}>
                    <Layout>
                        <Header style={{display: 'flex', alignItems: 'center'}}>
                            <div className="demo-logo"/>
                            <Space size={"small"} style={{marginLeft: 'auto'}}>
                                <Space size={"small"} style={{color: "white"}}>
                                    <p>{t('general.darkMode', {ns: ['main']})}</p>
                                    <Switch onChange={changeTheme}/>
                                </Space>
                                <LanguageSelector/>
                            </Space>
                        </Header>
                        <Content style={{padding: '0 50px'}}>
                            <Layout style={{padding: '24px 0', background: "white"}}>
                                <Sider trigger={null} collapsible collapsed={collapsed}>
                                    <div className="demo-logo-vertical"/>
                                    <MenuAnt />
                                </Sider>
                                <Header style={{padding: 0, background: colorBgContainer}}>
                                    <Button
                                        type="text"
                                        icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                        onClick={() => setCollapsed(!collapsed)}
                                        style={{
                                            fontSize: '16px',
                                            width: 64,
                                            height: 64,
                                        }}
                                    />
                                </Header>
                                <Content style={{padding: '0 24px', minHeight: 280}}>
                                    <Routes>
                                        <Route path='*' element={<Error/>}/>
                                        <Route path='/' element={<Home/>}/>
                                        <Route path='/unauthorized' element={<Unauthorized/>}/>
                                        <Route path='/counter' element={
                                            <ProtectedRoute predicate={keycloak?.authenticated}
                                                            redirectPath={"/unauthorized"}>
                                                <Counter/>
                                            </ProtectedRoute>
                                        }/>
                                        <Route path='/users' element={
                                            <ProtectedRoute predicate={keycloak?.authenticated}
                                                            redirectPath={"/unauthorized"}>
                                                <Users/>
                                            </ProtectedRoute>
                                        }/>
                                    </Routes>
                                </Content>
                            </Layout>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>Ant Design ©2023 Created by Ant UED</Footer>
                    </Layout>
                </ConfigProvider>
            </GlobalSettingsContext.Provider>
        </div>
    )
}

export default App
