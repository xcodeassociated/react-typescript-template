import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { persistor, store } from './store/store'
import App from '@/App'
import keycloak from '@/lib/keycloak'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { PersistGate } from 'redux-persist/integration/react'
import '@/locales/i18n'

test('renders learn react link', () => {
  const { getByText } = render(
    <ReactKeycloakProvider authClient={keycloak}>
      <React.StrictMode>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </React.StrictMode>
    </ReactKeycloakProvider>
  )

  // eslint-disable-next-line testing-library/prefer-screen-queries
  expect(getByText(/Loading.../i)).toBeInTheDocument()
})
