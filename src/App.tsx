import React from 'react';
import { Counter } from './features/counter/Counter';
import {useKeycloak} from "@react-keycloak/web";
import {Route, Routes} from 'react-router-dom';
import {Home} from "./home/Home";
import Login from "./login/Login";
import keycloak from "./features/counter/keycloak";

const App: React.FC = () => {
    const { initialized } = useKeycloak()

    if (!initialized) {
        return <div>Loading...</div>
    }

  return (
    <div className="App">
        <Routes>
            <Route path='/' element={<Home />} />
            {keycloak?.authenticated ? <Route path='/counter' element={<Counter />} /> : null}
            <Route path='/login' element={<Login />} />
        </Routes>
    </div>
  );
}

export default App;
