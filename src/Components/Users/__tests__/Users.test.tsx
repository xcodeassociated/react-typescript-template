import React, {act} from "react";
import {render, screen} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {Users} from "../Users";
import {GlobalSettingsContext} from "../../App/App";
import {MockedProvider} from "@apollo/client/testing";
import "../../../i18n"
import {GetAllPermissionsDocument} from "../../../graphql/generated";

// const mockedRoles = [
//     {
//         "description": "Anonymous user who can only read info",
//         "_id": "63c16ce71ba30e5f08b4d66e",
//         "name": "GUEST"
//     }
// ]

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

};

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

describe('user component tests', () => {
    test('renders users component', async () => {
        let mock = new MockAdapter(axios)
        // note: mock every possible BE endpoint
        // node.js endpoints
        mock.onGet("http://localhost:4500/users?page=0&size=10&sort=id&direction=ASC").reply(200, mockedUsers)
        mock.onGet("http://localhost:4500/usersCount").reply(200, 1)
        // kotlin: coroutine endpoints
        mock.onGet("http://localhost:8080/coroutine/users?page=0&size=10&sort=id&direction=ASC").reply(200, mockedUsers)
        mock.onGet("http://localhost:8080/coroutine/usersCount").reply(200, 1)
        // kotlin: reactive endpoints
        mock.onGet("http://localhost:8080/reactive/users?page=0&size=10&sort=id&direction=ASC").reply(200, mockedUsers)
        mock.onGet("http://localhost:8080/reactive/usersCount").reply(200, 1)

        // non-graphql
        // mock.onGet("http://localhost:4500/permissions").reply(200, mockedRoles)
        // mock.onGet("http://localhost:8080/coroutine/permissions").reply(200, mockedRoles)
        // mock.onGet("http://localhost:8080/reactive/permissions").reply(200, mockedRoles)


        // eslint-disable-next-line testing-library/no-unnecessary-act
        await act(async () => render(
            <React.StrictMode>
                <GlobalSettingsContext.Provider value={{theme: {isDark: false}}}>
                    <BrowserRouter>
                        <MockedProvider mocks={[mockedRolesGql]} addTypename={false}>
                            <Users/>
                        </MockedProvider>
                    </BrowserRouter>
                </GlobalSettingsContext.Provider>
            </React.StrictMode>
        ))

        expect(screen.getByText(/John Snow/i)).toBeInTheDocument()
        expect(screen.getByText(/john.snow@email.com/i)).toBeInTheDocument()
        expect(screen.getByText(/GUEST/i)).toBeInTheDocument()
    })
})