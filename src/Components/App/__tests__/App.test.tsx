import React from 'react';
import {render} from '@testing-library/react';
import {Provider} from 'react-redux';
import {store} from '../../../Store/store';
import App from '../App';
import keycloak from "../../../Keycloak/keycloak";
import {ReactKeycloakProvider} from '@react-keycloak/web'

test('renders learn react link', () => {
  const { getByText } = render(
      <ReactKeycloakProvider authClient={keycloak} >
          <React.StrictMode>
              <Provider store={store}>
                  <App />
              </Provider>
          </React.StrictMode>
      </ReactKeycloakProvider>
  );

    // eslint-disable-next-line testing-library/prefer-screen-queries
  expect(getByText(/Loading.../i)).toBeInTheDocument();
});
