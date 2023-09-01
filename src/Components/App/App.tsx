import React, {useState} from "react";
import {Counter} from "../Counter/Counter";
import {useKeycloak} from "@react-keycloak/web";
import {Navigate, Route, Routes} from "react-router-dom";
import {Home} from "../Home/Home"
import {Error, Unauthorized} from "../Error/Error";
import {MenuProvider} from "../Menu/MenuProvider";
import {Users} from "../Users/Users";
import {Button, Layout, theme} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';

const {Header, Content, Footer, Sider} = Layout

// @ts-ignore
const ProtectedRoute = ({predicate, redirectPath = '/', children}) => {
    if (!predicate) {
        return <Navigate to={redirectPath} replace/>
    }
    return children
}

const App: React.FC = () => {
    const {initialized, keycloak} = useKeycloak()
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    if (!initialized) {
        return <div>Loading...</div>
    }

    return (
        <div className="App">
            <Layout>
                <Header style={{display: 'flex', alignItems: 'center'}}>
                    <div className="demo-logo"/>
                    <Button>Test</Button>
                    <Button style={{ marginLeft: 'auto' }}>Test</Button>
                </Header>
                <Content style={{padding: '0 50px'}}>
                    <Layout style={{padding: '24px 0', background: "white"}}>
                        <Sider trigger={null} collapsible collapsed={collapsed}>
                            <div className="demo-logo-vertical" />
                            <MenuProvider/>
                        </Sider>
                        <Header style={{ padding: 0, background: colorBgContainer }}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
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
                                    <ProtectedRoute predicate={keycloak?.authenticated} redirectPath={"/unauthorized"}>
                                        <Counter/>
                                    </ProtectedRoute>
                                }/>
                                <Route path='/users' element={
                                    <ProtectedRoute predicate={keycloak?.authenticated} redirectPath={"/unauthorized"}>
                                        <Users/>
                                    </ProtectedRoute>
                                }/>
                            </Routes>
                        </Content>
                    </Layout>
                </Content>
                <Footer style={{textAlign: 'center'}}>Ant Design ©2023 Created by Ant UED</Footer>
            </Layout>
        </div>
    )
}

export default App
