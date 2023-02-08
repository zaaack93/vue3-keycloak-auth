import Keycloak from 'keycloak-js'

const initOptions = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  onLoad: 'login-required',
}

export const keycloak = new Keycloak(initOptions)

export const CallLogin = (onAuthenticatedCallback) => {
  keycloak
    .init({ onLoad: initOptions.onLoad })
    .then((auth) => {
      if (auth) {
        onAuthenticatedCallback()
      } else {
        window.location.reload()
      }

      //Token Refresh
      keycloak
        .updateToken(70)
        .then((refreshed) => {
          if (refreshed) {
            console.log('Token refreshed' + refreshed)
          }
        })
        .catch(() => {
          console.log('Failed to refresh token')
        })
    })
    .catch(() => {
      console.log('Authenticated Failed')
    })
}
