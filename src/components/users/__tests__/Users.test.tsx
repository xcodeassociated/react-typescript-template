import React, {act} from "react"
import {render, screen, waitFor} from "@testing-library/react"
import {BrowserRouter} from "react-router-dom"
import {Users} from "../Users"
import {GlobalSettingsContext} from "../../app/App"
import {MockedProvider} from "@apollo/client/testing"
import "../../../i18n"
import {GetAllPermissionsDocument} from "../../../graphql/generated"
import {store} from "../../../store/store"
import {http, HttpResponse} from 'msw'
import {setupServer} from "msw/node"
import {usersApi} from "../api/usersApi"
import {Provider} from "react-redux"

const mockedRolesGql = {
    request: {
        query: GetAllPermissionsDocument,
        variables: {
            page: 0,
            size: 10,
            sort: "id",
            direction: "ASC"
        }
    },

    result: {
        data: { getAllPermissions: [{ id: "63c16ce71ba30e5f08b4d66e", name: "GUEST" }] }
    }

}

const mockedUsers = [
    {
        "_id": "63c16cfe1ba30e5f08b4d66f",
        "name": "John Snow",
        "email": "john.snow@email.com",
        "role": [
            {
                "description": "Anonymous user who can only read info",
                "_id": "63c16ce71ba30e5f08b4d66e",
                "name": "GUEST"
            }
        ]
    }
]
export const handlers = [
    http.get("http://localhost:8080/coroutine/users", () => {
        return HttpResponse.json(mockedUsers)
    }),
    http.get("http://localhost:8080/coroutine/usersCount", () => {
            return HttpResponse.json(1)
    })
]

export const server = setupServer(...handlers)

server.events.on('request:start', ({ request }) => {
    // example: console.debug('Outgoing:', request.method, request.url)
})

describe('user component tests', () => {
    beforeAll(() => {
        server.listen()
        act(() => store.dispatch(usersApi.util.resetApiState()))
    })

    afterEach(() => {
        server.resetHandlers()
        act(() => store.dispatch(usersApi.util.resetApiState()))
    })

    afterAll(() => {
        server.close()
    })

    test('renders users component', async () => {
        await act(async () => render(
            <React.StrictMode>
                <Provider store={store}>
                    <GlobalSettingsContext.Provider value={{theme: {isDark: false}}}>
                        <BrowserRouter>
                            <MockedProvider mocks={[mockedRolesGql]} addTypename={false}>
                                <Users/>
                            </MockedProvider>
                        </BrowserRouter>
                    </GlobalSettingsContext.Provider>
                </Provider>
            </React.StrictMode>
        ))

        await screen.findByText("Loading...")

        await waitFor(() => {
            expect(screen.getByText(/John Snow/i)).toBeInTheDocument()
            expect(screen.getByText(/john.snow@email.com/i)).toBeInTheDocument()
            expect(screen.getByText(/GUEST/i)).toBeInTheDocument()
        })
    })
})