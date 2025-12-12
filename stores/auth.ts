import { defineStore } from 'pinia'

interface User {
    id: number
    email: string
    name: string
    role: 'EMPLOYEE' | 'MANAGER' | 'HR'
    companyId: number
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: null as string | null,
        loading: false
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
        isHR: (state) => state.user?.role === 'HR',
        isManager: (state) => state.user?.role === 'MANAGER',
        isEmployee: (state) => state.user?.role === 'EMPLOYEE'
    },
    actions: {
        async login(credentials: { email: string; password: string }) {
            this.loading = true
            try {
                const data = await $fetch('/api/auth/login', {
                    method: 'POST',
                    body: credentials
                })

                if (data) {
                    this.user = data.user
                    this.token = data.token
                    return true
                }
                return false
            } catch (error) {
                console.error('Login error:', error)
                return false
            } finally {
                this.loading = false
            }
        },

        async fetchUser() {
            try {
                const data = await $fetch('/api/auth/me')
                if (data) {
                    this.user = data
                }
            } catch (error) {
                console.error('Fetch user error:', error)
                this.user = null
                this.token = null
            }
        },

        async logout() {
            await $fetch('/api/auth/logout', { method: 'POST' })
            this.user = null
            this.token = null
            navigateTo('/auth/login')
        }
    }
})
