import { createRouter, createWebHistory } from 'vue-router'
import SimpleMenu from '@/layouts/simple-menu/Main.vue'
import Users from '@/views/Users.vue'

const routes = [
  /*{
    path: "/",
    name: "login",
    component: Login,
  },*/
  {
    path: '/',
    component: SimpleMenu,
    children: [
      {
        path: '/',
        name: 'users',
        component: Users,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
})

export default router
