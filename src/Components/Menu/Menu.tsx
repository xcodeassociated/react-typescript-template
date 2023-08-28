import React from "react";
import {Link} from "react-router-dom";
import {useKeycloak} from "@react-keycloak/web";

export const Menu: React.FC = () => {
    const { keycloak } = useKeycloak()
    return (
        <div>
            <ul>
                <li><Link to='/'>Home</Link></li>
                {keycloak?.authenticated ? <li><Link to='/counter'>Counter</Link></li> : null}
                {keycloak?.authenticated ? <li><Link to='/users'>Users</Link></li> : null}
                {!keycloak?.authenticated ? <li><Link to='/login'>Login</Link></li> : null}
            </ul>
            {keycloak?.authenticated ?
                <button type="button" onClick={() =>  keycloak.logout()}>
                    Logout
                </button> : <></>}
        </div>
    )
}