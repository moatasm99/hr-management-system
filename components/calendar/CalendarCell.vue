<template>
  <div class="h-32 border border-gray-200 dark:border-gray-700 p-2 relative hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
    @click="$emit('click', date)">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300" :class="{ 'text-gray-400': !isCurrentMonth }">
      {{ dayNumber }}
    </span>
    
    <div class="mt-2 space-y-1">
      <div v-if="attendance" class="flex flex-wrap gap-1">
        <span v-if="attendance.checkIn" class="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
          {{ formatTime(attendance.checkIn) }}
        </span>
        <span v-if="attendance.checkOut" class="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
          {{ formatTime(attendance.checkOut) }}
        </span>
      </div>
      <div v-else-if="isToday" class="text-xs text-blue-600 font-medium">
        Today
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  date: Date
  isCurrentMonth: boolean
  attendance?: any
}>()

const dayNumber = computed(() => format(props.date, 'd'))
const isToday = computed(() => {
  const today = new Date()
  return props.date.getDate() === today.getDate() &&
         props.date.getMonth() === today.getMonth() &&
         props.date.getFullYear() === today.getFullYear()
})

const formatTime = (dateStr: string) => {
  return format(new Date(dateStr), 'HH:mm')
}
</script>
