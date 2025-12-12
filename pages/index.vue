<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1 text-sm">Welcome back! Here's your attendance overview</p>
    </div>

    <!-- Check-In/Out Buttons Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Check-In Button -->
      <button 
        @click="handleCheckInClick"
        :disabled="!attendanceStore.canCheckIn || loading"
        :class="[
          'relative rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center space-y-4 group',
          attendanceStore.canCheckIn && !loading
            ? 'bg-[#5B00BC] hover:bg-[#4C009E] shadow-lg shadow-indigo-200 dark:shadow-none text-white cursor-pointer'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        ]"
      >
        <div 
          :class="[
            'w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110',
            attendanceStore.canCheckIn && !loading ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
          ]"
        >
          <ArrowRightEndOnRectangleIcon class="w-8 h-8" />
        </div>
        <div class="text-center">
          <span class="text-xl font-medium block">Check-In</span>
          <span v-if="attendanceStore.todayAttendance?.checkInTime" class="text-sm opacity-80 mt-1 block">
            {{ attendanceStore.todayAttendance.checkInTime }}
          </span>
        </div>
      </button>

      <!-- Check-Out Button -->
      <button 
        @click="handleCheckOutClick"
        :disabled="!attendanceStore.canCheckOut || loading"
        :class="[
          'relative rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center space-y-4 group',
          attendanceStore.canCheckOut && !loading
            ? 'bg-[#5B00BC] hover:bg-[#4C009E] shadow-lg shadow-indigo-200 dark:shadow-none text-white cursor-pointer'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        ]"
      >
        <div 
          :class="[
            'w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110',
            attendanceStore.canCheckOut && !loading ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
          ]"
        >
          <ArrowLeftStartOnRectangleIcon class="w-8 h-8" />
        </div>
        <div class="text-center">
          <span class="text-xl font-medium block">Check-Out</span>
          <span v-if="attendanceStore.todayAttendance?.checkOutTime" class="text-sm opacity-80 mt-1 block">
            {{ attendanceStore.todayAttendance.checkOutTime }}
          </span>
        </div>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Working Days -->
      <div class="bg-white dark:bg-black rounded-2xl p-6 border border-gray-100 dark:border-zinc-900 shadow-sm flex items-center space-x-4">
        <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <CalendarIcon class="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <p class="text-gray-400 text-xs font-medium mb-1">Working Days</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">19</p>
        </div>
      </div>

      <!-- Late Days -->
      <div class="bg-white dark:bg-black rounded-2xl p-6 border border-gray-100 dark:border-zinc-900 shadow-sm flex items-center space-x-4">
        <div class="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <ClockIcon class="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <p class="text-gray-400 text-xs font-medium mb-1">Late Days</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">2</p>
        </div>
      </div>

      <!-- Absent Days -->
      <div class="bg-white dark:bg-black rounded-2xl p-6 border border-gray-100 dark:border-zinc-900 shadow-sm flex items-center space-x-4">
        <div class="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <ExclamationCircleIcon class="w-6 h-6 text-red-500" />
        </div>
        <div>
          <p class="text-gray-400 text-xs font-medium mb-1">Absent Days</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">4</p>
        </div>
      </div>

      <!-- Overtime Hours -->
      <div class="bg-white dark:bg-black rounded-2xl p-6 border border-gray-100 dark:border-zinc-900 shadow-sm flex items-center space-x-4">
        <div class="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <ChartBarIcon class="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <p class="text-gray-400 text-xs font-medium mb-1">Overtime Hours</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">5.5<span class="text-sm font-normal text-gray-400 ml-1">hours</span></p>
        </div>
      </div>
    </div>

    <!-- Leave Balance Section -->
    <div class="bg-white dark:bg-black rounded-2xl p-8 border border-gray-100 dark:border-zinc-900 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-8">Leave Balance</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Casual Leave -->
        <div class="border-l-4 border-gray-100 dark:border-zinc-900 pl-6">
          <p class="text-gray-400 text-sm mb-2">Casual Leave</p>
          <div class="flex items-baseline space-x-2">
            <p class="text-4xl font-bold text-gray-900 dark:text-white">8</p>
            <p class="text-gray-400 text-xs">days left</p>
          </div>
        </div>

        <!-- Annual Leave -->
        <div class="border-l-4 border-gray-100 dark:border-zinc-900 pl-6">
          <p class="text-gray-400 text-sm mb-2">Annual Leave</p>
          <div class="flex items-baseline space-x-2">
            <p class="text-4xl font-bold text-gray-900 dark:text-white">12</p>
            <p class="text-gray-400 text-xs">days left</p>
          </div>
        </div>

        <!-- Exceptional Leave -->
        <div class="border-l-4 border-gray-100 dark:border-zinc-900 pl-6">
          <p class="text-gray-400 text-sm mb-2">Exceptional Leave</p>
          <div class="flex items-baseline space-x-2">
            <p class="text-4xl font-bold text-gray-900 dark:text-white">5</p>
            <p class="text-gray-400 text-xs">days left</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Section -->
    <ComprehensiveCalendar
      v-model="currentDate"
      :attendance-data="calendarData"
      :loading="calendarLoading"
      @day-click="handleDayClick"
    />

    <!-- Floating Action Button -->
    <button
      @click="showRequestModal = true"
      class="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group z-40"
      title="New Request"
    >
      <PlusIcon class="w-6 h-6 transition-transform group-hover:rotate-90" />
    </button>

    <!-- Request Modal -->
    <!-- Request Modal -->
    <RequestModal
      :show="showRequestModal"
      :preselected-date="selectedRequestDate"
      @close="() => { showRequestModal = false; selectedRequestDate = undefined }"
    />

    <!-- Day Details Modal -->
    <DayDetailsModal
      :show="showDayModal"
      :day="selectedDay"
      @close="showDayModal = false"
      @request="openRequestFromDay"
    />

    <!-- Location Selection Modal -->
    <div v-if="showLocationModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showLocationModal = false">
      <div class="bg-white dark:bg-black rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Select {{ modalType === 'checkIn' ? 'Check-In' : 'Check-Out' }} Location
        </h3>
        
        <div class="grid grid-cols-2 gap-4 mb-8">
          <button
            v-for="loc in locations"
            :key="loc.id"
            @click="selectLocation(loc.id)"
            class="p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex flex-col items-center justify-center space-y-2 group"
          >
            <span class="text-3xl group-hover:scale-110 transition-transform">{{ loc.icon }}</span>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ loc.label }}</span>
          </button>
        </div>

        <button
          @click="showLocationModal = false"
          class="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import Heroes Icons
import { 
  ArrowRightEndOnRectangleIcon, 
  ArrowLeftStartOnRectangleIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

import ComprehensiveCalendar from '~/components/calendar/ComprehensiveCalendar.vue'
import DayDetailsModal from '~/components/attendance/DayDetailsModal.vue'

definePageMeta({
  layout: 'main-layout'
})

const attendanceStore = useAttendanceStore()
const loading = ref(false)
const showLocationModal = ref(false)
const showRequestModal = ref(false)
const showDayModal = ref(false)
const modalType = ref<'checkIn' | 'checkOut'>('checkIn')
const selectedDay = ref(null)
const selectedRequestDate = ref<string | undefined>(undefined)

const locations = [
  { id: 'main-office', icon: '🏢', label: 'Main Office' },
  { id: 'branch-office', icon: '🏛️', label: 'Branch Office' },
  { id: 'remote', icon: '🏠', label: 'Remote' },
  { id: 'client-site', icon: '📍', label: 'Client Site' }
]

const handleCheckInClick = () => {
  if (!attendanceStore.canCheckIn || loading.value) return
  modalType.value = 'checkIn'
  showLocationModal.value = true
}

const handleCheckOutClick = () => {
  if (!attendanceStore.canCheckOut || loading.value) return
  modalType.value = 'checkOut'
  showLocationModal.value = true
}

const selectLocation = async (location: string) => {
  loading.value = true
  showLocationModal.value = false
  
  const toast = useToast()
  
  try {
    if (modalType.value === 'checkIn') {
      await attendanceStore.checkIn(location)
      toast.success('✅ Checked in successfully!')
    } else {
      await attendanceStore.checkOut(location)
      toast.success('✅ Checked out successfully!')
    }
  } catch (error: any) {
    toast.error('❌ ' + error.message)
  } finally {
    loading.value = false
  }
}

const handleDayClick = (day: any) => {
  selectedDay.value = day
  showDayModal.value = true
}

const openRequestFromDay = (date: string) => {
  selectedRequestDate.value = date
  showRequestModal.value = true
}

// Calendar Logic
const currentDate = ref(new Date())
const calendarData = ref(null)
const calendarLoading = ref(false)

const loadCalendar = async () => {
  calendarLoading.value = true
  calendarData.value = await attendanceStore.fetchMonthAttendance(currentDate.value)
  calendarLoading.value = false
}

watch(currentDate, () => {
  loadCalendar()
})

// Load today's attendance and calendar on mount
onMounted(async () => {
  await Promise.all([
    attendanceStore.fetchTodayAttendance(),
    loadCalendar()
  ])
})
</script>
