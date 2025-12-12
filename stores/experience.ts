import { defineStore } from 'pinia'

export interface Announcement {
    id: number
    title: string
    content: string
    type: string
    createdAt: string
    updatedAt: string
}

export interface Kudos {
    id: number
    fromUserId: number
    toUserId: number
    message: string
    badge: string
    createdAt: string
    fromUser?: { name: string }
    toUser?: { name: string }
}

export const useExperienceStore = defineStore('experience', {
    state: () => ({
        announcements: [] as Announcement[],
        kudos: [] as Kudos[],
        loading: false
    }),

    actions: {
        async fetchAnnouncements() {
            this.loading = true
            try {
                const data: any = await $fetch('/api/experience/announcements')
                if (data && data.announcements) {
                    this.announcements = data.announcements
                }
            } catch (error) {
                console.error('Failed to fetch announcements:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchKudos() {
            this.loading = true
            try {
                const data: any = await $fetch('/api/experience/kudos')
                if (data && data.kudos) {
                    this.kudos = data.kudos
                }
            } catch (error) {
                console.error('Failed to fetch kudos:', error)
            } finally {
                this.loading = false
            }
        },

        async sendKudos(toUserId: number, message: string, badge: string) {
            try {
                const data: any = await $fetch('/api/experience/kudos', {
                    method: 'POST',
                    body: { toUserId, message, badge }
                })

                if (data && data.success) {
                    this.kudos.unshift(data.kudos)
                    return true
                }
                return false
            } catch (error: any) {
                console.error('Failed to send kudos:', error)
                throw new Error(error.data?.statusMessage || 'Failed to send kudos')
            }
        }
    }
})
