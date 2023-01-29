import React from 'react';
import {Counter} from '../Counter/Counter';
import {useKeycloak} from "@react-keycloak/web";
import {Navigate, Route, Routes} from 'react-router-dom';
import {Home} from "../Home/Home";
import Login from "../Login/Login";
import {NotFound} from "../NotFound/NotFound";
import {Menu} from '../Menu/Menu';
import {Users} from "../Users/Users";

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
        <Menu />
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
    </div>
  );
}

export default App;
