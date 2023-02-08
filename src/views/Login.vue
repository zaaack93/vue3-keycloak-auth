<script setup>
import { onMounted } from 'vue'
import DarkModeSwitcher from '@/components/dark-mode-switcher/Main.vue'
import dom from '@left4code/tw-starter/dist/js/dom'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  dom('body').removeClass('main').removeClass('error-page').addClass('login')
})

const handleLogin = () => {
  router.push('/users')
}
</script>

<template>
  <div>
    <DarkModeSwitcher />
    <div class='container sm:px-10'>
      <div class='block xl:grid grid-cols-2 gap-4'>
        <!-- BEGIN: Login Info -->
        <div class='hidden xl:flex flex-col min-h-screen'>
          <a href='' class='-intro-x flex items-center pt-5'>
            <img
              alt='Midone Tailwind HTML Admin Template'
              class='w-6'
              src='@/assets/images/logo.svg'
            />
            <span class='text-white text-lg ml-3'> Enigma </span>
          </a>
          <div class='my-auto'>
            <img
              alt='Midone Tailwind HTML Admin Template'
              class='-intro-x w-1/2 -mt-16'
              src='@/assets/images/illustration.svg'
            />
            <div
              class='-intro-x text-white font-medium text-4xl leading-tight mt-10'
            >
              A few more clicks to <br />
              sign in to your account.
            </div>
            <div
              class='-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400'
            >
              Manage all your e-commerce accounts in one place
            </div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class='h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0'>
          <div
            class='my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto'
          >
            <h2
              class='intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left'
            >
              Sign In
            </h2>
            <div class='intro-x mt-5 text-center xl:text-left'>
              <button
                class='btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top'
                @click='handleLogin'
              >
                Login
              </button>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>
