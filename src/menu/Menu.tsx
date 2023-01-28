import React from "react";
import { Link } from "react-router-dom";
import {useKeycloak} from "@react-keycloak/web";
import keycloak from "../features/counter/keycloak";

interface MenuProps {}

export const Menu: React.FC<MenuProps> = () => {

    return (
        <>
            <div>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li>{keycloak?.authenticated ? <Link to='/counter'>Counter</Link> : <Link to='/login'>Login</Link>}</li>
                </ul>
                {keycloak?.authenticated ?
                    <button type="button" onClick={() => keycloak.logout()}>
                        Logout
                    </button> : <></>}
                <hr />
            </div>
        </>
    )
}