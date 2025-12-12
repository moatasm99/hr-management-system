<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Penalty</h1>
    
    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Employee ID</label>
        <input type="number" v-model="form.userId" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <p class="mt-1 text-xs text-gray-500">Enter the ID of the employee.</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
        <input type="number" v-model="form.amount" required step="0.01" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
        <textarea v-model="form.reason" rows="3" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
      </div>

      <div class="flex justify-end">
        <NuxtLink to="/penalties" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-3">
          Cancel
        </NuxtLink>
        <button type="submit" :disabled="penaltiesStore.loading" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          {{ penaltiesStore.loading ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main-layout'})

const penaltiesStore = usePenaltiesStore()
const form = reactive({
  userId: '',
  amount: '',
  reason: ''
})

const handleSubmit = async () => {
  const success = await penaltiesStore.createPenalty(form)
  if (success) {
    navigateTo('/penalties')
  }
}
</script>
