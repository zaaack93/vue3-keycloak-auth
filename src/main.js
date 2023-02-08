import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import globalComponents from './global-components'
import utils from './utils'
import { CallLogin } from '@/services/keycloakService'

const app = createApp(App).use(router).use(createPinia())

globalComponents(app)
utils(app)

CallLogin(() => {
  app.mount('#app')
})
