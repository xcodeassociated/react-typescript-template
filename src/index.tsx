import React from "react"
import {createRoot} from "react-dom/client"
import {Provider} from "react-redux"
import {persistor, store} from "./store/store"
import {PersistGate} from "redux-persist/integration/react"
import App from "./components/app/App"
import reportWebVitals from "./reportWebVitals"
import "./index.css"
import keycloak from "./keycloak/keycloak"
import {ReactKeycloakProvider} from "@react-keycloak/web"
import {AuthClientError, AuthClientEvent} from "@react-keycloak/core/lib/types"
import {AuthClientTokens} from "@react-keycloak/core"
import {BrowserRouter} from "react-router-dom"
import './i18n'
import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from "@apollo/client"
import {setContext} from "@apollo/client/link/context"

const container = document.getElementById("root")!
const root = createRoot(container)

const onKeycloakEvent = (event: AuthClientEvent, error?: AuthClientError): void => {
    if (error) {
        console.error("Keycloak error: " + JSON.stringify(error))
    }
}

const onKeycloakTokens = (tokens: AuthClientTokens): void => {
    // handle keycloak token
    // console.info("Keycloak token: " + JSON.stringify(tokens))
}

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/graphql',
})

const authLink = setContext((_, {headers}) => {
    const token = keycloak.token
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
})

root.render(
    <ReactKeycloakProvider authClient={keycloak} onEvent={onKeycloakEvent} onTokens={onKeycloakTokens}
                           initOptions={{onLoad: "check-sso", redirectUri: "http://localhost:3000/"}}>
        <React.StrictMode>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <ApolloProvider client={client}>
                            <App/>
                        </ApolloProvider>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </React.StrictMode>
    </ReactKeycloakProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
