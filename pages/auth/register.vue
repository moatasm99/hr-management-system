<template>
  <div>
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        {{ $t('auth.registerTitle') }}
      </h2>
    </div>
    <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="company-name" class="sr-only">{{ $t('auth.companyName') }}</label>
          <input id="company-name" name="companyName" type="text" required v-model="form.companyName"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            :placeholder="$t('auth.companyName')">
        </div>
        <div>
          <label for="admin-name" class="sr-only">{{ $t('auth.adminName') }}</label>
          <input id="admin-name" name="adminName" type="text" required v-model="form.adminName"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            :placeholder="$t('auth.adminName')">
        </div>
        <div>
          <label for="email-address" class="sr-only">{{ $t('auth.adminEmail') }}</label>
          <input id="email-address" name="email" type="email" autocomplete="email" required v-model="form.adminEmail"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            :placeholder="$t('auth.adminEmail')">
        </div>
        <div>
          <label for="password" class="sr-only">{{ $t('common.password') }}</label>
          <input id="password" name="password" type="password" autocomplete="new-password" required v-model="form.password"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            :placeholder="$t('common.password')">
        </div>
      </div>

      <div>
        <button type="submit" :disabled="loading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
          {{ loading ? $t('common.loading') : $t('common.register') }}
        </button>
      </div>

      <div class="text-center mt-4">
        <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
          {{ $t('auth.loginTitle') }}
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
const loading = ref(false)
const form = reactive({
  companyName: '',
  adminName: '',
  adminEmail: '',
  password: ''
})

const handleRegister = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/auth/register-company', {
      method: 'POST',
      body: form
    })
    
    if (data) {
      authStore.user = data.user
      authStore.token = data.token
      navigateTo('/')
    }
  } catch (error: any) {
    console.error(error)
    alert('Registration failed: ' + (error.data?.statusMessage || error.message))
  } finally {
    loading.value = false
  }
}
</script>
