<template>
  <div v-if="payrollStore.currentPayslip">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Payslip</h1>
      <button @click="print" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
        Print
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
      <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ payrollStore.currentPayslip.user.company.name }}</h2>
        <p class="text-gray-500">{{ formatMonth(payrollStore.currentPayslip.month) }}</p>
      </div>

      <div class="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p class="text-sm font-medium text-gray-500">Employee Name</p>
          <p class="text-lg font-bold text-gray-900 dark:text-white">{{ payrollStore.currentPayslip.user.name }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Email</p>
          <p class="text-lg text-gray-900 dark:text-white">{{ payrollStore.currentPayslip.user.email }}</p>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Basic Salary</p>
            <p class="text-lg text-gray-900 dark:text-white">{{ payrollStore.currentPayslip.basicSalary }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Additions</p>
            <p class="text-lg text-green-600">+{{ payrollStore.currentPayslip.additions }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Deductions</p>
            <p class="text-lg text-red-600">-{{ payrollStore.currentPayslip.deductions }}</p>
          </div>
          <div class="col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
            <p class="text-sm font-medium text-gray-500">Net Salary</p>
            <p class="text-2xl font-bold text-primary-600">{{ payrollStore.currentPayslip.netSalary }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12">
    <p class="text-gray-500">Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

definePageMeta({
  layout: 'main-layout',
  middleware: 'auth-global'
})

const route = useRoute()
const payrollStore = usePayrollStore()

const formatMonth = (dateStr: string) => format(new Date(dateStr), 'MMMM yyyy')

const print = () => {
  window.print()
}

onMounted(() => {
  payrollStore.fetchPayslip(parseInt(route.params.id as string))
})
</script>
