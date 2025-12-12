<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ $t('nav.settings') }}</h1>

    <div class="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Company Settings</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
          <input type="text" value="Your Company" disabled class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
          <select class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm">
            <option>English</option>
            <option>Arabic</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
          <select class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm">
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </div>

        <div class="pt-4">
          <button class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main-layout',
  middleware: 'role-check'
})
</script>
