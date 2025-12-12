<template>
  <div class="bg-white dark:bg-black rounded-lg shadow overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-900">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ currentMonthName }}
      </h2>
      <div class="flex space-x-2 rtl:space-x-reverse">
        <button @click="prevMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          &lt;
        </button>
        <button @click="nextMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          &gt;
        </button>
      </div>
    </div>

    <!-- Days Header -->
    <div class="grid grid-cols-7 border-b border-gray-200 dark:border-zinc-900 bg-gray-50 dark:bg-gray-900">
      <div v-for="day in weekDays" :key="day" class="py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
        {{ day }}
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-7 bg-gray-200 dark:bg-gray-700 gap-px">
      <CalendarCell v-for="day in calendarDays" :key="day.date.toISOString()"
        :date="day.date"
        :is-current-month="day.isCurrentMonth"
        :attendance="getAttendanceForDate(day.date)"
        class="bg-white dark:bg-black"
        @click="handleDayClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, format, addMonths, subMonths, isSameDay 
} from 'date-fns'
import CalendarCell from './CalendarCell.vue'

const props = defineProps<{
  attendanceRecords: any[]
}>()

const emit = defineEmits(['month-change', 'day-click'])

const currentDate = ref(new Date())

const currentMonthName = computed(() => format(currentDate.value, 'MMMM yyyy'))

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentDate.value))
  const end = endOfWeek(endOfMonth(currentDate.value))
  
  return eachDayOfInterval({ start, end }).map(date => ({
    date,
    isCurrentMonth: date.getMonth() === currentDate.value.getMonth()
  }))
})

const getAttendanceForDate = (date: Date) => {
  return props.attendanceRecords.find(record => isSameDay(new Date(record.date), date))
}

const prevMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
  emit('month-change', currentDate.value)
}

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
  emit('month-change', currentDate.value)
}

const handleDayClick = (date: Date) => {
  emit('day-click', date)
}
</script>
