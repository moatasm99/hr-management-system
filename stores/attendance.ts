import { defineStore } from 'pinia'
import { format } from 'date-fns'

interface AttendanceRecord {
    id: number
    date: string
    checkIn: string | null
    checkOut: string | null
    location: string | null
    status: string[]
}

interface TodayAttendance {
    hasCheckedIn: boolean
    hasCheckedOut: boolean
    checkInTime: string | null
    checkOutTime: string | null
    location: string | null
}

export const useAttendanceStore = defineStore('attendance', {
    state: () => ({
        attendanceRecords: [] as AttendanceRecord[],
        currentMonth: new Date(),
        loading: false,
        todayAttendance: null as TodayAttendance | null
    }),

    getters: {
        canCheckIn: (state) => !state.todayAttendance?.hasCheckedIn,
        canCheckOut: (state) => state.todayAttendance?.hasCheckedIn && !state.todayAttendance?.hasCheckedOut
    },

    actions: {
        async fetchMonthAttendance(date: Date) {
            this.loading = true
            try {
                const monthStr = format(date, 'yyyy-MM-dd')
                const data: any = await $fetch(`/api/attendance/month?date=${monthStr}`)
                if (data && data.records) {
                    this.attendanceRecords = data.records
                }
                return data
            } catch (e) {
                console.error('Failed to fetch attendance:', e)
                return null
            } finally {
                this.loading = false
            }
        },

        async fetchTodayAttendance() {
            try {
                const data: any = await $fetch('/api/attendance/today')
                if (data) {
                    this.todayAttendance = {
                        hasCheckedIn: !!data.checkIn,
                        hasCheckedOut: !!data.checkOut,
                        checkInTime: data.checkIn ? format(new Date(data.checkIn), 'HH:mm') : null,
                        checkOutTime: data.checkOut ? format(new Date(data.checkOut), 'HH:mm') : null,
                        location: data.location
                    }
                }
            } catch (e) {
                // No attendance today yet
                this.todayAttendance = {
                    hasCheckedIn: false,
                    hasCheckedOut: false,
                    checkInTime: null,
                    checkOutTime: null,
                    location: null
                }
            }
        },

        async checkIn(location: string) {
            try {
                const data: any = await $fetch('/api/attendance/check-in', {
                    method: 'POST',
                    body: { location }
                })

                if (data && data.success) {
                    await this.fetchTodayAttendance()
                    await this.fetchMonthAttendance(this.currentMonth)
                    return true
                }
                return false
            } catch (error: any) {
                console.error('Check-in failed:', error)
                throw new Error(error.data?.statusMessage || 'Failed to check in')
            }
        },

        async checkOut(location: string) {
            try {
                const data: any = await $fetch('/api/attendance/check-out', {
                    method: 'POST',
                    body: { location }
                })

                if (data && data.success) {
                    await this.fetchTodayAttendance()
                    await this.fetchMonthAttendance(this.currentMonth)
                    return true
                }
                return false
            } catch (error: any) {
                console.error('Check-out failed:', error)
                throw new Error(error.data?.statusMessage || 'Failed to check out')
            }
        }
    }
})
