import React from 'react';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import App from '../App';
import keycloak from "../features/counter/keycloak";
import { ReactKeycloakProvider } from '@react-keycloak/web'

test('renders learn react link', () => {
  const { getByText } = render(
      <ReactKeycloakProvider authClient={keycloak} >
          <Provider store={store}>
              <App />
          </Provider>
      </ReactKeycloakProvider>
  );

    // eslint-disable-next-line testing-library/prefer-screen-queries
  expect(getByText(/Loading.../i)).toBeInTheDocument();
});
