import React from 'react';
import { render, screen } from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";
import { Home } from '../Home';
import keycloak from "../../../Keycloak/keycloak";
import {ReactKeycloakProvider} from "@react-keycloak/web";

test('renders home page component', () => {
    render(
        <ReactKeycloakProvider authClient={keycloak} >
            <React.StrictMode>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </React.StrictMode>
        </ReactKeycloakProvider>
    );

    const element = screen.getByText(/home page/i);
    expect(element).toBeInTheDocument();
});