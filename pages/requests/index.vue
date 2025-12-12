<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Requests</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">View and manage your submitted requests</p>
      </div>
      <button
        @click="showRequestModal = true"
        class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>New Request</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Pending</p>
            <p class="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">{{ requestsStore.pendingRequests.length }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-600 dark:text-green-400 text-sm font-medium">Approved</p>
            <p class="text-3xl font-bold text-green-700 dark:text-green-300 mt-1">{{ requestsStore.approvedRequests.length }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-600 dark:text-red-400 text-sm font-medium">Rejected</p>
            <p class="text-3xl font-bold text-red-700 dark:text-red-300 mt-1">{{ requestsStore.rejectedRequests.length }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Requests List -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">All Requests</h2>
      </div>

      <div v-if="requestsStore.loading" class="p-12 text-center">
        <div class="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500 dark:text-gray-400 mt-4">Loading requests...</p>
      </div>

      <div v-else-if="requestsStore.requests.length === 0" class="p-12 text-center">
        <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400">No requests yet</p>
        <button
          @click="showRequestModal = true"
          class="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Submit your first request
        </button>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="request in requestsStore.requests"
          :key="request.id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ formatRequestType(request.type) }}
                </h3>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    request.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' :
                    request.status === 'APPROVED' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                    'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                  ]"
                >
                  {{ request.status }}
                </span>
              </div>

              <div class="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDate(request.fromDate) }}</span>
                  <span v-if="request.toDate">- {{ formatDate(request.toDate) }}</span>
                </div>
                <div v-if="request.fromTime" class="flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ request.fromTime }}</span>
                  <span v-if="request.toTime">- {{ request.toTime }}</span>
                </div>
              </div>

              <p class="text-gray-600 dark:text-gray-300 mb-2">{{ request.reason }}</p>

              <p class="text-xs text-gray-400 dark:text-gray-500">
                Submitted {{ formatDateTime(request.createdAt) }}
              </p>

              <div v-if="request.rejectionReason" class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-sm text-red-700 dark:text-red-300">
                  <strong>Rejection Reason:</strong> {{ request.rejectionReason }}
                </p>
              </div>
            </div>

            <button
              v-if="request.status === 'PENDING'"
              @click="deleteRequest(request.id)"
              class="ml-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              title="Delete request"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Modal -->
    <RequestModal
      :show="showRequestModal"
      @close="handleModalClose"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

definePageMeta({
  layout: 'main-layout'
})

const requestsStore = useRequestsStore()
const toast = useToast()
const showRequestModal = ref(false)

const formatRequestType = (type: string) => {
  return type.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ')
}

const formatDate = (dateStr: string) => {
  return format(new Date(dateStr), 'MMM dd, yyyy')
}

const formatDateTime = (dateStr: string) => {
  return format(new Date(dateStr), 'MMM dd, yyyy HH:mm')
}

const deleteRequest = async (id: number) => {
  if (!confirm('Are you sure you want to delete this request?')) return
  
  try {
    await requestsStore.deleteRequest(id)
    toast.success('✅ Request deleted successfully')
  } catch (error: any) {
    toast.error('❌ ' + error.message)
  }
}

const handleModalClose = () => {
  showRequestModal.value = false
  // Refresh the list
  requestsStore.fetchRequests()
}

// Load requests on mount
onMounted(() => {
  requestsStore.fetchRequests()
})
</script>
