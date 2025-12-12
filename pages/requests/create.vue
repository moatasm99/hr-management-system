<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">New Request</h1>
    
    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Request Type</label>
        <select v-model="form.type" required class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="CASUAL_LEAVE">Casual Leave</option>
          <option value="ANNUAL_LEAVE">Annual Leave</option>
          <option value="SICK_LEAVE">Sick Leave</option>
          <option value="MARRIAGE_LEAVE">Marriage Leave</option>
          <option value="EXTRA_WORKING_DAY">Extra Working Day</option>
          <option value="OVERTIME_HOURS">Overtime Hours</option>
          <option value="EXTERNAL_WORK">External Work</option>
          <option value="LATE_ARRIVAL">Late Arrival</option>
          <option value="EARLY_LEAVE">Early Leave</option>
        </select>
      </div>

      <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
          <input type="date" v-model="form.startDate" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
          <input type="date" v-model="form.endDate" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
        <textarea v-model="form.reason" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
      </div>

      <div class="flex justify-end">
        <NuxtLink to="/requests" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3">
          Cancel
        </NuxtLink>
        <button type="submit" :disabled="requestsStore.loading" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          {{ requestsStore.loading ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main-layout'})

const requestsStore = useRequestsStore()
const form = reactive({
  type: 'CASUAL_LEAVE',
  startDate: '',
  endDate: '',
  reason: ''
})

const handleSubmit = async () => {
  const success = await requestsStore.createRequest(form)
  if (success) {
    navigateTo('/requests')
  }
}
</script>
