<template>
  <div class="h-full flex flex-col gap-2 relative p-[8px] box-border">
    <!-- Header: Date + Status Icon -->
    <div class="flex justify-between items-start leading-none mb-1">
      <span 
        class="text-sm font-bold transition-colors"
        :class="isToday ? 'text-indigo-600 scale-110' : 'text-[var(--text-primary)]'"
      >
        {{ dayNumber }}
      </span>
      
      <!-- Warning Icon for Late/Absent -->
      <div v-if="showWarning" class="text-amber-500" title="Attention Needed">
        <ExclamationTriangleIcon class="w-4 h-4" />
      </div>
    </div>

    <!-- Time Range Row (Middle) -->
    <div v-if="attendance" class="flex justify-between items-center text-[11px] text-[var(--text-secondary)]">
      <div v-if="attendance.checkIn" class="flex items-center gap-1">
        <ClockIcon class="w-3 h-3" />
        <span>{{ formatTime(attendance.checkIn) }}</span>
      </div>
      <div v-if="attendance.checkOut" class="flex items-center gap-1">
        <span>{{ formatTime(attendance.checkOut) }}</span>
      </div>
    </div>

    <!-- Location Pill -->
    <div v-if="attendance?.location" class="w-fit mt-1">
      <div class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
        <MapPinIcon class="w-2.5 h-2.5" />
        <span class="truncate max-w-[80px]">{{ attendance.location }}</span>
      </div>
    </div>

    <!-- Tags Area (Stacked) -->
    <div class="mt-auto flex flex-col gap-[4px] pt-1 w-full relative">
      <!-- Status Tag (Late/Early/Absent) -->
      <div 
        v-if="statusConfig" 
        class="flex items-center px-[6px] py-[4px] rounded-[6px] text-[10px] font-medium border min-h-[22px] w-full truncate"
        :style="{ backgroundColor: statusConfig.bg, color: statusConfig.text, borderColor: statusConfig.border }"
      >
        <span class="truncate w-full">{{ statusConfig.label }}</span>
      </div>

      <!-- Request Tags -->
      <div 
        v-for="req in displayRequests" 
        :key="req.id"
        class="flex items-center px-[6px] py-[4px] rounded-[6px] text-[10px] font-medium border min-h-[22px] w-full truncate"
        :style="getRequestStyle(req.type)"
      >
        <span class="truncate w-full">{{ formatRequestLabel(req.type) }}</span>
      </div>
      
      <!-- More Indicator -->
      <div v-if="remainingRequests > 0" class="text-[10px] text-[var(--text-secondary)] pl-1">
        +{{ remainingRequests }} more
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { ClockIcon, MapPinIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  dayNumber: string
  isToday: boolean
  attendance?: any
  requests?: any[]
}>()

const formatTime = (timeStr: string) => format(new Date(timeStr), 'HH:mm')

const formatRequestLabel = (type: string) => {
  return type.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')
}

// Convert type to kebab-case (e.g. CASUAL_LEAVE -> casual-leave)
const toKebabCase = (str: string) => str.toLowerCase().replace(/_/g, '-')

// Get dynamic style based on type
const getRequestStyle = (type: string) => {
  const kebab = toKebabCase(type)
  // Check if variable exists is hard in JS, but assuming globals.css has them
  // If not found, it won't apply color. I'll rely on correct mapping.
  // Mapping 'CASUAL_LEAVE' -> 'casual-leave'.
  return {
    backgroundColor: `var(--status-${kebab}-bg)`,
    color: `var(--status-${kebab}-text)`,
    borderColor: `var(--status-${kebab}-border)`
  }
}

// Logic for Status Tag
const statusConfig = computed(() => {
  if (!props.attendance?.status?.length) return null
  
  const s = props.attendance.status[0]
  // Map common statuses
  const kebab = toKebabCase(s)
  
  // Specific labels map if needed
  let label = s.charAt(0) + s.slice(1).toLowerCase()
  if (s === 'LATE') label = 'Late Arrival'
  
  return { 
    label, 
    bg: `var(--status-${kebab}-bg)`, 
    text: `var(--status-${kebab}-text)`,
    border: `var(--status-${kebab}-border)`
  }
})

// Logic for Warning Icon
const showWarning = computed(() => {
  return props.attendance?.status?.includes('ABSENT') || props.attendance?.status?.includes('LATE')
})

// Logic for Requests Limiting
// 'Stacked' layout takes more vertical space. If height is fixed, we might only fit 2-3 items.
// User said "Max one-line text... truncate".
const MAX_TAGS = 3
const displayRequests = computed(() => props.requests?.slice(0, MAX_TAGS) || [])
const remainingRequests = computed(() => Math.max(0, (props.requests?.length || 0) - MAX_TAGS))

</script>
