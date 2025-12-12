<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="close">
    <div class="bg-white dark:bg-black rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-900 p-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ step === 1 ? 'Select Request Type' : 'Request Details' }}
          </h2>
          <button @click="close" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Step 1: Select Request Type -->
      <div v-if="step === 1" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            v-for="type in requestTypes"
            :key="type.value"
            @click="selectType(type)"
            class="p-6 border-2 border-gray-200 dark:border-zinc-900 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left group"
          >
            <div class="flex items-start space-x-4">
              <div class="text-3xl">{{ type.icon }}</div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {{ type.label }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ type.description }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Step 2: Fill Form -->
      <div v-if="step === 2" class="p-6">
        <button @click="step = 1" class="text-indigo-600 dark:text-indigo-400 hover:underline mb-4 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Change Request Type
        </button>

        <form @submit.prevent="submitRequest" class="space-y-6">
          <!-- Selected Type Display -->
          <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">Request Type:</p>
            <p class="font-semibold text-indigo-600 dark:text-indigo-400">{{ selectedType?.label }}</p>
          </div>

          <!-- From Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Date *
            </label>
            <input
              v-model="form.fromDate"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-zinc-900 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <!-- To Date (if required) -->
          <div v-if="selectedType?.requiresEndDate">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Date *
            </label>
            <input
              v-model="form.toDate"
              type="date"
              :required="selectedType?.requiresEndDate"
              class="w-full px-4 py-2 border border-gray-300 dark:border-zinc-900 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <!-- From Time (if required) -->
          <div v-if="selectedType?.requiresTime" class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Time *
              </label>
              <input
                v-model="form.fromTime"
                type="time"
                :required="selectedType?.requiresTime"
                class="w-full px-4 py-2 border border-gray-300 dark:border-zinc-900 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Time *
              </label>
              <input
                v-model="form.toTime"
                type="time"
                :required="selectedType?.requiresTime"
                class="w-full px-4 py-2 border border-gray-300 dark:border-zinc-900 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <!-- Reason -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason *
            </label>
            <textarea
              v-model="form.reason"
              required
              rows="4"
              placeholder="Please provide a detailed reason for your request..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-zinc-900 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:text-white resize-none"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex space-x-4">
            <button
              type="button"
              @click="close"
              class="flex-1 py-3 px-4 bg-gray-200 dark:bg-zinc-900 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Submitting...' : 'Submit Request' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RequestType, RequestFormData } from '~/stores/requests'

interface Props {
  show: boolean
  preselectedDate?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  submit: [data: RequestFormData]
}>()

const requestsStore = useRequestsStore()
const toast = useToast()
const loading = ref(false)
const step = ref(1)
const selectedType = ref<any>(null)

const form = ref<RequestFormData>({
  type: 'CASUAL_LEAVE',
  fromDate: props.preselectedDate || '',
  toDate: '',
  fromTime: '',
  toTime: '',
  reason: ''
})

const requestTypes = [
  {
    value: 'CASUAL_LEAVE',
    label: 'Casual Leave',
    icon: '🏖️',
    description: 'Short-term personal leave',
    requiresEndDate: true,
    requiresTime: false
  },
  {
    value: 'ANNUAL_LEAVE',
    label: 'Annual Leave',
    icon: '✈️',
    description: 'Vacation or annual leave',
    requiresEndDate: true,
    requiresTime: false
  },
  {
    value: 'EXCEPTIONAL_LEAVE',
    label: 'Exceptional Leave',
    icon: '🚨',
    description: 'Emergency or exceptional circumstances',
    requiresEndDate: true,
    requiresTime: false
  },
  {
    value: 'EXTERNAL_WORK_HOURS',
    label: 'External Work (Hours)',
    icon: '🏢',
    description: 'Work outside office for specific hours',
    requiresEndDate: false,
    requiresTime: true
  },
  {
    value: 'EXTERNAL_WORK_DAYS',
    label: 'External Work (Days)',
    icon: '📅',
    description: 'Work outside office for full days',
    requiresEndDate: true,
    requiresTime: false
  },
  {
    value: 'LATE_ARRIVAL',
    label: 'Late Arrival',
    icon: '⏰',
    description: 'Request for late check-in',
    requiresEndDate: false,
    requiresTime: true
  },
  {
    value: 'EARLY_LEAVE',
    label: 'Early Leave',
    icon: '🏃',
    description: 'Request to leave early',
    requiresEndDate: false,
    requiresTime: true
  },
  {
    value: 'OVERTIME_HOURS',
    label: 'Overtime (Hours)',
    icon: '💪',
    description: 'Request overtime for specific hours',
    requiresEndDate: false,
    requiresTime: true
  },
  {
    value: 'OVERTIME_DAY',
    label: 'Overtime (Full Day)',
    icon: '📊',
    description: 'Request overtime for full day',
    requiresEndDate: false,
    requiresTime: false
  }
]

const selectType = (type: any) => {
  selectedType.value = type
  form.value.type = type.value as RequestType
  step.value = 2
}

const submitRequest = async () => {
  loading.value = true
  
  try {
    await requestsStore.createRequest(form.value)
    toast.success('✅ Request submitted successfully!')
    close()
  } catch (error: any) {
    toast.error('❌ ' + error.message)
  } finally {
    loading.value = false
  }
}

const close = () => {
  step.value = 1
  selectedType.value = null
  form.value = {
    type: 'CASUAL_LEAVE',
    fromDate: props.preselectedDate || '',
    toDate: '',
    fromTime: '',
    toTime: '',
    reason: ''
  }
  emit('close')
}

// Watch for preselected date changes
watch(() => props.preselectedDate, (newDate) => {
  if (newDate) {
    form.value.fromDate = newDate
  }
})
</script>
