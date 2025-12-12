import { defineStore } from 'pinia'

export const useTeamStore = defineStore('team', {
    state: () => ({
        loading: false,
        teamAttendance: [] as any[]
    }),

    actions: {
        async fetchTeamAttendance() {
            this.loading = true
            try {
                const data = await $fetch('/api/manager/team-attendance')
                this.teamAttendance = data as any[]
            } catch (error) {
                console.error('Failed to fetch team attendance', error)
            } finally {
                this.loading = false
            }
        }
    }
})
