import { defineStore } from 'pinia'

export interface PayrollData {
    id: number
    month: string // "2025-12"
    baseSalary: number
    additions: PayrollItem[]
    deductions: PayrollItem[]
    overtimePayment: number
    workingDays: number
    overtimeHours: number
    netSalary: number
}

export interface PayrollItem {
    label: string
    amount: number
}

export const usePayrollStore = defineStore('payroll', {
    state: () => ({
        currentPayroll: null as PayrollData | null,
        payrollHistory: [] as PayrollData[],
        loading: false,
        selectedMonth: new Date()
    }),

    getters: {
        totalAdditions: (state) => {
            if (!state.currentPayroll) return 0
            return state.currentPayroll.additions.reduce((sum, item) => sum + item.amount, 0)
        },
        totalDeductions: (state) => {
            if (!state.currentPayroll) return 0
            return state.currentPayroll.deductions.reduce((sum, item) => sum + item.amount, 0)
        },
        grossSalary: (state) => {
            if (!state.currentPayroll) return 0
            return state.currentPayroll.baseSalary + (state.totalAdditions as number) + state.currentPayroll.overtimePayment
        }
    },

    actions: {
        async fetchCurrentPayroll() {
            this.loading = true
            try {
                const data: any = await $fetch('/api/payroll/current')
                if (data && data.payroll) {
                    this.currentPayroll = data.payroll
                }
            } catch (error) {
                console.error('Failed to fetch payroll:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchPayrollByMonth(year: number, month: number) {
            this.loading = true
            try {
                const data: any = await $fetch(`/api/payroll/${year}/${month}`)
                if (data && data.payroll) {
                    this.currentPayroll = data.payroll
                }
            } catch (error) {
                console.error('Failed to fetch payroll:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchPayrollHistory() {
            this.loading = true
            try {
                const data: any = await $fetch('/api/payroll/history')
                if (data && data.payrolls) {
                    this.payrollHistory = data.payrolls
                }
            } catch (error) {
                console.error('Failed to fetch payroll history:', error)
            } finally {
                this.loading = false
            }
        }
    }
})
