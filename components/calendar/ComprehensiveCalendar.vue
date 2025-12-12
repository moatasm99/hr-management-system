<template>
  <div class="w-full space-y-4 pt-4">
    <!-- Modern Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <!-- Left: Title & Subtitle -->
      <div class="space-y-0.5">
        <h2 class="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          {{ currentMonthName }} {{ currentYear }}
        </h2>
        <p class="text-sm text-[var(--text-secondary)] font-medium">
          Attendance Calendar
        </p>
      </div>
      
      <!-- Right: Actions -->
      <div class="flex items-center gap-3">
        <!-- Today Button -->
        <button
          @click="goToToday"
          class="px-4 py-2 text-sm font-medium rounded-xl transition-colors border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--hover-background)] focus:ring-2 focus:ring-indigo-500/20"
        >
          Today
        </button>

        <!-- Navigation Buttons -->
        <div class="flex items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-xl">
          <button
            @click="previousMonth"
            class="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] shadow-sm hover:shadow transition-all"
            title="Previous Month"
          >
            <ChevronLeftIcon class="w-5 h-5" />
          </button>
          
          <div class="w-px h-4 bg-[var(--border-color)] mx-1"></div>

          <button
            @click="nextMonth"
            :disabled="isCurrentMonth"
            :class="[
              'p-2 rounded-lg transition-all',
              isCurrentMonth 
                ? 'opacity-30 cursor-not-allowed' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] shadow-sm hover:shadow'
            ]"
            title="Next Month"
          >
            <ChevronRightIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Legend moved to bottom -->

    <!-- Loading State -->
    <!-- Loading State -->
    <div v-if="loading" class="h-[400px] flex items-center justify-center bg-[var(--bg-card)] rounded-[10px] border border-[var(--border-color)]">
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div class="w-4 h-4 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div class="w-4 h-4 bg-indigo-600 rounded-full animate-bounce"></div>
        </div>
        <span class="text-[var(--text-secondary)] text-sm font-medium animate-pulse">Loading attendance...</span>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div v-else class="space-y-2">
      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 gap-4 text-center px-1">
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide"
        >
          {{ day }}
        </div>
      </div>

      <!-- Days -->
      <div class="grid grid-cols-7 gap-4">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="day.date && emit('day-click', day)"
          class="calendar-day-card min-h-[160px] relative transition-all duration-200 overflow-hidden group cursor-pointer"
          :class="[
            day.date ? 'has-date' : 'pointer-events-none opacity-0 sm:opacity-100 sm:bg-transparent'
          ]"
        >
          <CalendarDayCell 
            v-if="day.date"
            :day-number="day.dayNumber"
            :is-today="day.isToday"
            :attendance="day.attendance"
            :requests="day.requests"
          />
        </div>
      </div>
    </div>

    <!-- Legend (Grid Layout) -->
    <div class="mt-8 pt-6 border-t border-[var(--border-color)]">
      <h3 class="text-sm font-bold text-[var(--text-primary)] mb-4">Legend</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 align-middle sm:flex-nowrap gap-4 text-xs">
        
        <!-- Normal -->
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded border flex items-center justify-center p-0.5" style="border-color: var(--status-present-text)">
             <div class="w-full h-full rounded-sm opacity-20" style="background-color: var(--status-present-text)"></div>
          </div>
          <span class="text-[var(--text-secondary)]">Normal</span>
        </div>

        <!-- Holiday -->
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded border flex items-center justify-center p-0.5" style="border-color: #3b82f6">
             <div class="w-full h-full rounded-sm bg-blue-500/20"></div>
          </div>
          <span class="text-[var(--text-secondary)]">Holiday</span>
        </div>

        <!-- Late -->
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded border flex items-center justify-center p-0.5" style="border-color: var(--status-late-text)">
            <div class="w-full h-full rounded-sm opacity-20" style="background-color: var(--status-late-text)"></div>
          </div>
          <span class="text-[var(--text-secondary)]">Late</span>
        </div>

        <!-- Weekend -->
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded border flex items-center justify-center p-0.5 border-gray-500">
             <div class="w-full h-full rounded-sm bg-gray-500/20"></div>
          </div>
          <span class="text-[var(--text-secondary)]">Weekend</span>
        </div>

        <!-- Overtime -->
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded border flex items-center justify-center p-0.5" style="border-color: var(--status-overtime-text)">
             <div class="w-full h-full rounded-sm opacity-20" style="background-color: var(--status-overtime-text)"></div>
          </div>
          <span class="text-[var(--text-secondary)]">Overtime</span>
        </div>

        <!-- Penalty -->
        <div class="flex items-center gap-2">
           <div class="w-4 h-4 rounded border flex items-center justify-center p-0.5 border-red-500">
              <ExclamationCircleIcon class="w-3 h-3 text-red-500" />
           </div>
           <span class="text-[var(--text-secondary)]">Penalty</span>
        </div>

        <!-- Absent -->
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded border flex items-center justify-center p-0.5" style="border-color: var(--status-absent-text)">
            <div class="w-full h-full rounded-sm opacity-20" style="background-color: var(--status-absent-text)"></div>
          </div>
          <span class="text-[var(--text-secondary)]">Absent</span>
        </div>
        
        <!-- Missing Punch -->
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded border flex items-center justify-center p-0.5 border-amber-500">
             <ExclamationTriangleIcon class="w-3 h-3 text-amber-500" />
          </div>
          <span class="text-[var(--text-secondary)]">Missing Punch</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format, startOfMonth, endOfMonth, getDay, isSameMonth, isToday as checkIsToday, addMonths, subMonths } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import CalendarDayCell from './CalendarDayCell.vue'

const props = defineProps<{
  modelValue: Date
  attendanceData: any
  loading: boolean
}>()

const emit = defineEmits(['update:modelValue', 'day-click'])

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthName = computed(() => format(props.modelValue, 'MMMM'))
const currentYear = computed(() => format(props.modelValue, 'yyyy'))
const isCurrentMonth = computed(() => isSameMonth(props.modelValue, new Date()))

const calendarDays = computed(() => {
  if (!props.attendanceData) return []

  const monthStart = startOfMonth(props.modelValue)
  const startDay = getDay(monthStart)

  const days = []

  // Add empty cells for days before month starts
  for (let i = 0; i < startDay; i++) {
    days.push({ date: null })
  }

  // Add actual days
  props.attendanceData.calendar.forEach((day: any) => {
    const date = new Date(day.date)
    days.push({
      date: day.date,
      dayNumber: format(date, 'd'),
      isToday: checkIsToday(date),
      isWeekend: day.dayOfWeek === 0 || day.dayOfWeek === 6,
      attendance: day.attendance,
      requests: day.requests
    })
  })

  return days
})

const previousMonth = () => {
  emit('update:modelValue', subMonths(props.modelValue, 1))
}

const nextMonth = () => {
  if (!isCurrentMonth.value) {
    emit('update:modelValue', addMonths(props.modelValue, 1))
  }
}

const goToToday = () => {
  emit('update:modelValue', new Date())
}
</script>

<style scoped>
.calendar-day-card.has-date {
  background-color: var(--bg-card); /* Fallback or specific secondary var */
  /* User requested background: var(--background-secondary) for cells? 
     "background: var(--background-secondary)" isn't standard, it implies var(--bg-secondary).
     I'll use var(--bg-card) which is card bg. */
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
}

.calendar-day-card.has-date:hover {
  background-color: var(--hover-background);
  border-color: var(--text-secondary); /* Subtle Highlight */
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
}
</style>
