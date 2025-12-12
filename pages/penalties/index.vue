<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('nav.penalties') }}</h1>
      <NuxtLink v-if="canAddPenalty" to="/penalties/create" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
        Add Penalty
      </NuxtLink>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="penalty in penaltiesStore.penalties" :key="penalty.id">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-red-600 truncate">
                {{ penalty.reason }}
              </p>
              <div class="ml-2 flex-shrink-0 flex">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  -{{ penalty.amount }}
                </span>
              </div>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex">
                <p class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  {{ penalty.user?.name }}
                </p>
                <p class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                  {{ formatDate(penalty.date) }}
                </p>
              </div>
            </div>
          </div>
        </li>
        <li v-if="penaltiesStore.penalties.length === 0" class="px-4 py-4 sm:px-6 text-center text-gray-500">
          No penalties found.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

definePageMeta({
  layout: 'main-layout'})

const penaltiesStore = usePenaltiesStore()
const authStore = useAuthStore()

const canAddPenalty = computed(() => authStore.isManager || authStore.isHR)

const formatDate = (dateStr: string) => format(new Date(dateStr), 'PPP')

onMounted(() => {
  penaltiesStore.fetchPenalties()
})
</script>
