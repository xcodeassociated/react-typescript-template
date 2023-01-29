import * as React from 'react'
import {useCallback} from 'react'
import {Navigate} from 'react-router-dom'

import {useKeycloak} from '@react-keycloak/web'

const LoginPage = () => {
  const { keycloak } = useKeycloak()
  const login = useCallback(() => {
    keycloak?.login()
  }, [keycloak])

  if (keycloak?.authenticated)
    return <Navigate to={'/'} />

  return (
    <div>
      <button type="button" onClick={login}>
        Login
      </button>
    </div>
  )
}

export default LoginPage
