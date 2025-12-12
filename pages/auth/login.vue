<template>
  <div>
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        {{ $t('auth.loginTitle') }}
      </h2>
    </div>
    <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email-address" class="sr-only">{{ $t('common.email') }}</label>
          <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            :placeholder="$t('common.email')">
        </div>
        <div>
          <label for="password" class="sr-only">{{ $t('common.password') }}</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            :placeholder="$t('common.password')">
        </div>
      </div>

      <div>
        <button type="submit" :disabled="authStore.loading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <!-- Heroicon name: solid/lock-closed -->
            <svg class="h-5 w-5 text-primary-500 group-hover:text-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </span>
          {{ authStore.loading ? $t('common.loading') : $t('common.login') }}
        </button>
      </div>
      
      <div class="text-center mt-4">
        <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
          {{ $t('auth.registerTitle') }}
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const success = await authStore.login({ email: email.value, password: password.value })
  if (success) {
    navigateTo('/')
  } else {
    alert('Login failed')
  }
}
</script>
