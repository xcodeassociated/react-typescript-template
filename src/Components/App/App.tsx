import React from 'react';
import {Counter} from '../Counter/Counter';
import {useKeycloak} from "@react-keycloak/web";
import {Navigate, Route, Routes} from 'react-router-dom';
import {Home} from "../Home/Home";
import Login from "../Login/Login";
import {NotFound} from "../NotFound/NotFound";
import {Menu} from '../Menu/Menu';
import {Users} from "../Users/Users";
import {Layout} from "antd";
const { Header, Content, Footer, Sider } = Layout;

// @ts-ignore
const ProtectedRoute = ({predicate, redirectPath = '/login', children}) => {
    if (!predicate) {
        return <Navigate to={redirectPath} replace />;
    }
    return children;
};

const App: React.FC = () => {
    const { initialized, keycloak } = useKeycloak()

    if (!initialized) {
        return <div>Loading...</div>
    }

  return (
    <div className="App">
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Layout style={{ padding: '24px 0', background: "white" }}>
                    <Sider style={{ background: "white" }} width={200}>
                        <Menu />
                    </Sider>
                    <Content style={{ padding: '0 24px', minHeight: 280 }}>
                        <Routes>
                            <Route path='*' element={<NotFound />} />
                            <Route path='/' element={<Home />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/counter' element={
                                <ProtectedRoute predicate={keycloak?.authenticated}>
                                    <Counter />
                                </ProtectedRoute>
                            } />
                            <Route path='/users' element={
                                <ProtectedRoute predicate={keycloak?.authenticated}>
                                    <Users />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </Content>
                </Layout>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>
    </div>
  );
}

export default App;
