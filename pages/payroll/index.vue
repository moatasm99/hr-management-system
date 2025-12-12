<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Payroll</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">View your salary breakdown and payment details</p>
      </div>

      <!-- Month Selector -->
      <div class="flex items-center space-x-4">
        <select
          v-model="selectedMonth"
          @change="loadPayroll"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        >
          <option v-for="month in availableMonths" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="payrollStore.loading" class="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
      <div class="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-500 dark:text-gray-400 mt-4">Loading payroll...</p>
    </div>

    <!-- Payroll Content -->
    <div v-else-if="payrollStore.currentPayroll" class="space-y-6">
      <!-- Net Salary Card -->
      <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-indigo-100 text-sm mb-2">Net Salary</p>
            <p class="text-5xl font-bold">${{ formatNumber(payrollStore.currentPayroll.netSalary) }}</p>
            <p class="text-indigo-100 text-sm mt-2">{{ currentMonthName }}</p>
          </div>
          <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Salary Breakdown Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Base Salary -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Base Salary</h3>
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">${{ formatNumber(payrollStore.currentPayroll.baseSalary) }}</p>
        </div>

        <!-- Overtime Payment -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Overtime Payment</h3>
            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">${{ formatNumber(payrollStore.currentPayroll.overtimePayment) }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ payrollStore.currentPayroll.overtimeHours }} hours</p>
        </div>
      </div>

      <!-- Additions & Deductions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Additions -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-green-700 dark:text-green-300">Additions</h3>
              <p class="text-2xl font-bold text-green-700 dark:text-green-300">+${{ formatNumber(payrollStore.totalAdditions) }}</p>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div
              v-for="(item, index) in payrollStore.currentPayroll.additions"
              :key="index"
              class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
            >
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-gray-700 dark:text-gray-300">{{ item.label }}</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">${{ formatNumber(item.amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Deductions -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-red-700 dark:text-red-300">Deductions</h3>
              <p class="text-2xl font-bold text-red-700 dark:text-red-300">-${{ formatNumber(payrollStore.totalDeductions) }}</p>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div
              v-for="(item, index) in payrollStore.currentPayroll.deductions"
              :key="index"
              class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
            >
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                <span class="text-gray-700 dark:text-gray-300">{{ item.label }}</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">${{ formatNumber(item.amount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Salary Calculation</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <span class="text-gray-600 dark:text-gray-400">Base Salary</span>
            <span class="font-semibold text-gray-900 dark:text-white">${{ formatNumber(payrollStore.currentPayroll.baseSalary) }}</span>
          </div>
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <span class="text-green-600 dark:text-green-400">+ Total Additions</span>
            <span class="font-semibold text-green-600 dark:text-green-400">${{ formatNumber(payrollStore.totalAdditions) }}</span>
          </div>
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <span class="text-purple-600 dark:text-purple-400">+ Overtime Payment</span>
            <span class="font-semibold text-purple-600 dark:text-purple-400">${{ formatNumber(payrollStore.currentPayroll.overtimePayment) }}</span>
          </div>
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <span class="text-red-600 dark:text-red-400">- Total Deductions</span>
            <span class="font-semibold text-red-600 dark:text-red-400">${{ formatNumber(payrollStore.totalDeductions) }}</span>
          </div>
          <div class="flex items-center justify-between pt-2">
            <span class="text-lg font-semibold text-gray-900 dark:text-white">Net Salary</span>
            <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${{ formatNumber(payrollStore.currentPayroll.netSalary) }}</span>
          </div>
        </div>
      </div>

      <!-- Attendance Summary -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Attendance Summary</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ payrollStore.currentPayroll.workingDays }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Working Days</p>
          </div>
          <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ payrollStore.currentPayroll.overtimeHours }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Overtime Hours</p>
          </div>
          <div class="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${{ formatNumber(payrollStore.currentPayroll.netSalary / payrollStore.currentPayroll.workingDays) }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Per Day</p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
      <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-500 dark:text-gray-400">No payroll data available for this month</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, subMonths } from 'date-fns'

definePageMeta({
  layout: 'main-layout'
})

const payrollStore = usePayrollStore()
const selectedMonth = ref(format(new Date(), 'yyyy-MM'))

const currentMonthName = computed(() => {
  const [year, month] = selectedMonth.value.split('-')
  return format(new Date(parseInt(year), parseInt(month) - 1), 'MMMM yyyy')
})

const availableMonths = computed(() => {
  const months = []
  const now = new Date()
  
  for (let i = 0; i < 12; i++) {
    const date = subMonths(now, i)
    months.push({
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy')
    })
  }
  
  return months
})

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const loadPayroll = () => {
  const [year, month] = selectedMonth.value.split('-')
  payrollStore.fetchPayrollByMonth(parseInt(year), parseInt(month))
}

onMounted(() => {
  payrollStore.fetchCurrentPayroll()
})
</script>
