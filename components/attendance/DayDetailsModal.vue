<template>
  <div v-if="show" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" @click.self="close">
    <div class="bg-[var(--bg-primary)] rounded-2xl w-full max-w-lg shadow-2xl transform transition-all relative overflow-hidden flex flex-col max-h-[90vh] border border-[var(--border-color)]">
      
      <!-- Header -->
      <div class="p-6 pb-2">
        <div class="flex justify-between items-start">
          <div class="space-y-1">
            <h2 class="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              {{ formattedFullDate }}
            </h2>
            <p 
              class="text-sm font-medium"
              :style="{ color: statusStyle.color }"
            >
              {{ primaryStatusLabel }}
            </p>
          </div>
          
          <!-- Close Button -->
          <button 
            @click="close" 
            class="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="p-6 space-y-4 overflow-y-auto">
        
        <!-- Attendance Information Card -->
        <div v-if="hasAttendanceInfo" class="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border-color)]">
          <div class="flex items-center gap-2 mb-4 text-[var(--text-primary)]">
            <ClockIcon class="w-5 h-5" />
            <h3 class="font-semibold text-sm">Attendance Information</h3>
          </div>
          
          <div class="grid grid-cols-2 gap-y-6 gap-x-4">
            <!-- Row 1 -->
            <div v-if="attendance?.checkIn">
              <p class="text-xs font-medium text-[var(--text-secondary)] mb-1">Check In Time</p>
              <p class="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                {{ formatTime(attendance.checkIn) }}
              </p>
            </div>

            <div v-if="attendance?.checkOut">
              <p class="text-xs font-medium text-[var(--text-secondary)] mb-1">Check Out Time</p>
              <p class="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                {{ formatTime(attendance.checkOut) }}
              </p>
            </div>

            <!-- Row 2 -->
            <div v-if="totalHours">
              <p class="text-xs font-medium text-[var(--text-secondary)] mb-1">Total Hours</p>
              <p class="text-lg font-bold text-[var(--text-primary)]">
                {{ totalHours }} <span class="text-sm font-normal text-[var(--text-secondary)]">hours</span>
              </p>
            </div>

            <div v-if="attendance?.lateMinutes">
              <p class="text-xs font-medium text-[var(--text-secondary)] mb-1">Late by</p>
              <p class="text-lg font-bold text-amber-500">
                {{ attendance.lateMinutes }} <span class="text-sm font-normal text-amber-500/80">minutes</span>
              </p>
            </div>

            <!-- Row 3 Location -->
            <div v-if="attendance?.location" class="col-span-2 pt-2">
              <div class="flex items-center gap-1 mb-1 text-[var(--text-secondary)]">
                <MapPinIcon class="w-4 h-4" />
                <p class="text-xs font-medium">Location</p>
              </div>
              <p class="text-base font-semibold text-[var(--text-primary)]">
                {{ attendance.location }}
              </p>
            </div>
          </div>
        </div>

        <!-- Requests Section Card -->
        <div v-if="requests?.length" class="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border-color)]">
          <div class="flex items-center gap-2 mb-4 text-[var(--text-primary)]">
            <DocumentTextIcon class="w-5 h-5" />
            <h3 class="font-semibold text-sm">Requests</h3>
          </div>

          <div class="space-y-3">
            <div 
              v-for="req in requests" 
              :key="req.id"
              class="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] flex justify-between items-start"
            >
              <div>
                <h4 class="font-bold text-sm text-[var(--text-primary)] mb-1">
                  {{ formatRequestType(req.type) }}
                </h4>
                <p v-if="req.reason" class="text-xs text-[var(--text-secondary)]">
                  {{ req.reason }}
                </p>
              </div>
              <span 
                class="text-xs font-medium"
                :class="{
                  'text-yellow-600 dark:text-yellow-400': req.status === 'PENDING',
                  'text-green-600 dark:text-green-400': req.status === 'APPROVED',
                  'text-red-600 dark:text-red-400': req.status === 'REJECTED'
                }"
              >
                {{ capitalize(req.status) }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="!hasAttendanceInfo && !requests?.length" class="bg-[var(--bg-secondary)] rounded-2xl p-8 text-center text-[var(--text-secondary)] border border-[var(--border-color)]">
          No activity recorded for this day.
        </div>

      </div>

      <!-- Footer Action -->
      <div class="p-6 pt-2 bg-[var(--bg-primary)]">
        <button 
          @click="requestForDay"
          class="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-semibold text-sm shadow-lg shadow-indigo-500/20"
        >
          Submit Request
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { format, differenceInMinutes } from 'date-fns'
import { XMarkIcon, ClockIcon, MapPinIcon, PlusIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  show: boolean
  day: any // AttendanceDay
}>()

const emit = defineEmits(['close', 'request'])

// Close on ESC
watch(() => props.show, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const close = () => {
  emit('close')
}

const requestForDay = () => {
  if (props.day?.date) {
    emit('request', props.day.date)
    close()
  }
}

// Data Accessors
const attendance = computed(() => props.day?.attendance)
const requests = computed(() => props.day?.requests)

// Formatting
const formattedFullDate = computed(() => props.day?.date ? format(new Date(props.day.date), 'EEEE, MMMM d, yyyy') : '')

const formatTime = (isoStr: string) => format(new Date(isoStr), 'HH:mm')
const formatRequestType = (type: string) => type.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

// Status Logic
const primaryStatus = computed(() => props.day?.attendance?.status?.[0])
const primaryStatusLabel = computed(() => {
  const s = primaryStatus.value
  if (!s) return ''
  if (s === 'LATE') return 'Late'
  return s.charAt(0) + s.slice(1).toLowerCase()
})

const toKebabCase = (str: string) => str.toLowerCase().replace(/_/g, '-')

const statusStyle = computed(() => {
  const s = primaryStatus.value
  if (!s) return {}
  const k = toKebabCase(s)
  return {
    color: `var(--status-${k}-text)`, // Text only as per design
  }
})

// Calculations
const hasAttendanceInfo = computed(() => !!attendance.value)

const totalHours = computed(() => {
  if (attendance.value?.checkIn && attendance.value?.checkOut) {
    const start = new Date(attendance.value.checkIn)
    const end = new Date(attendance.value.checkOut)
    const diff = differenceInMinutes(end, start)
    return (diff / 60).toFixed(1)
  }
  return null
})
</script>
