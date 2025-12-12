import { defineStore } from 'pinia'

export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'HR'

export interface Employee {
    id: number
    name: string
    email: string
    role: UserRole
    companyId: number
    createdAt: string
    updatedAt: string
}

export interface EmployeeStats {
    total: number
    presentToday: number
    onLeave: number
    absent: number
}

export const useEmployeeStore = defineStore('employees', {
    state: () => ({
        employees: [] as Employee[],
        stats: {
            total: 0,
            presentToday: 0,
            onLeave: 0,
            absent: 0
        } as EmployeeStats,
        loading: false,
        searchQuery: '',
        roleFilter: 'all',
        selectedEmployee: null as Employee | null
    }),

    getters: {
        filteredEmployees: (state) => {
            let filtered = state.employees

            // Search filter
            if (state.searchQuery) {
                const query = state.searchQuery.toLowerCase()
                filtered = filtered.filter(emp =>
                    emp.name.toLowerCase().includes(query) ||
                    emp.email.toLowerCase().includes(query)
                )
            }

            // Role filter
            if (state.roleFilter !== 'all') {
                filtered = filtered.filter(emp => emp.role === state.roleFilter)
            }

            return filtered
        },

        employeesByRole: (state) => {
            return {
                employees: state.employees.filter(e => e.role === 'EMPLOYEE').length,
                managers: state.employees.filter(e => e.role === 'MANAGER').length,
                hr: state.employees.filter(e => e.role === 'HR').length
            }
        }
    },

    actions: {
        async fetchEmployees() {
            this.loading = true
            try {
                const data: any = await $fetch('/api/hr/employees')
                if (data && data.employees) {
                    this.employees = data.employees
                    this.stats = data.stats || this.stats
                }
            } catch (error) {
                console.error('Failed to fetch employees:', error)
            } finally {
                this.loading = false
            }
        },

        async addEmployee(employeeData: Partial<Employee>) {
            try {
                const data: any = await $fetch('/api/hr/employees', {
                    method: 'POST',
                    body: employeeData
                })

                if (data && data.success) {
                    this.employees.push(data.employee)
                    this.stats.total++
                    return true
                }
                return false
            } catch (error: any) {
                console.error('Failed to add employee:', error)
                throw new Error(error.data?.statusMessage || 'Failed to add employee')
            }
        },

        async updateEmployee(id: number, employeeData: Partial<Employee>) {
            try {
                const data: any = await $fetch(`/api/hr/employees/${id}`, {
                    method: 'PATCH',
                    body: employeeData
                })

                if (data && data.success) {
                    const index = this.employees.findIndex(e => e.id === id)
                    if (index !== -1) {
                        this.employees[index] = { ...this.employees[index], ...data.employee }
                    }
                    return true
                }
                return false
            } catch (error: any) {
                console.error('Failed to update employee:', error)
                throw new Error(error.data?.statusMessage || 'Failed to update employee')
            }
        },

        async deleteEmployee(id: number) {
            try {
                const data: any = await $fetch(`/api/hr/employees/${id}`, {
                    method: 'DELETE'
                })

                if (data && data.success) {
                    this.employees = this.employees.filter(e => e.id !== id)
                    this.stats.total--
                    return true
                }
                return false
            } catch (error: any) {
                console.error('Failed to delete employee:', error)
                throw new Error(error.data?.statusMessage || 'Failed to delete employee')
            }
        },

        setSearchQuery(query: string) {
            this.searchQuery = query
        },

        setRoleFilter(role: string) {
            this.roleFilter = role
        }
    }
})
