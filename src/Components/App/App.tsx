import React from 'react';
import { Counter } from '../Counter/Counter';
import {useKeycloak} from "@react-keycloak/web";
import {Route, Routes} from 'react-router-dom';
import {Home} from "../Home/Home";
import Login from "../Login/Login";
import { Navigate, useLocation } from 'react-router-dom'
import {NotFound} from "../NotFound/NotFound";

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
        <Routes>
            <Route path='*' element={<NotFound />} />
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/counter' element={
                <ProtectedRoute predicate={keycloak?.authenticated}>
                    <Counter />
                </ProtectedRoute>
            } />
        </Routes>
    </div>
  );
}

export default App;
