import { defineStore } from 'pinia'
import { keycloak } from '@/services/keycloakService'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    keycloak,
    user: {
      id: keycloak.tokenParsed.sub,
      username: keycloak.tokenParsed.preferred_username,
      fullName: keycloak.tokenParsed.name,
    },
    accessToken: keycloak.token,
  }),
  actions: {
    logout: keycloak.logout,
  },
})
