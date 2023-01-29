import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {store} from './Store/store';
import App from './Components/App/App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import keycloak from "./Keycloak/keycloak";
import {ReactKeycloakProvider} from '@react-keycloak/web'
import {AuthClientError, AuthClientEvent} from "@react-keycloak/core/lib/types";
import {AuthClientTokens} from "@react-keycloak/core";
import {BrowserRouter} from "react-router-dom";

const container = document.getElementById('root')!;
const root = createRoot(container);

const onKeycloakEvent = (event: AuthClientEvent, error?: AuthClientError): void => {
    if (error) {
        console.error("Keycloak error: " + JSON.stringify(error))
    }
}

const onKeycloakTokens = (tokens: AuthClientTokens): void => {
    console.info("Keycloak token: " + JSON.stringify(tokens))
}

root.render(
  <ReactKeycloakProvider authClient={keycloak} onEvent={onKeycloakEvent} onTokens={onKeycloakTokens} initOptions={{onLoad: 'check-sso'}}>
      <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
      </React.StrictMode>
</ReactKeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
