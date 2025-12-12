import { defineStore } from 'pinia'

export type RequestType =
    | 'CASUAL_LEAVE'
    | 'ANNUAL_LEAVE'
    | 'EXCEPTIONAL_LEAVE'
    | 'EXTERNAL_WORK_HOURS'
    | 'EXTERNAL_WORK_DAYS'
    | 'LATE_ARRIVAL'
    | 'EARLY_LEAVE'
    | 'OVERTIME_HOURS'
    | 'OVERTIME_DAY'

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Request {
    id: number
    type: RequestType
    status: RequestStatus
    fromDate: string
    toDate?: string
    fromTime?: string
    toTime?: string
    reason: string
    attachments?: string[]
    createdAt: string
    updatedAt: string
    approvedBy?: string
    approvedAt?: string
    rejectedBy?: string
    rejectedAt?: string
    rejectionReason?: string
}

export interface RequestFormData {
    type: RequestType
    fromDate: string
    toDate?: string
    fromTime?: string
    toTime?: string
    reason: string
    attachments?: File[]
}

export const useRequestsStore = defineStore('requests', {
    state: () => ({
        requests: [] as Request[],
        loading: false,
        selectedRequest: null as Request | null
    }),

    getters: {
        pendingRequests: (state) => state.requests.filter(r => r.status === 'PENDING'),
        approvedRequests: (state) => state.requests.filter(r => r.status === 'APPROVED'),
        rejectedRequests: (state) => state.requests.filter(r => r.status === 'REJECTED')
    },

    actions: {
        async fetchRequests() {
            this.loading = true
            try {
                const data: any = await $fetch('/api/requests/my-requests')
                if (data && data.requests) {
                    this.requests = data.requests
                }
            } catch (error) {
                console.error('Failed to fetch requests:', error)
            } finally {
                this.loading = false
            }
        },

        async createRequest(formData: RequestFormData) {
            try {
                const data: any = await $fetch('/api/requests/submit', {
                    method: 'POST',
                    body: formData
                })

                if (data && data.success) {
                    if (data.request) {
                        this.requests.unshift(data.request)
                    }
                    return true
                }
                return false
            } catch (error: any) {
                console.error('Failed to submit request:', error)
                throw new Error(error.data?.statusMessage || 'Failed to submit request')
            }
        },

        async updateStatus(id: number, status: 'APPROVED' | 'REJECTED', comment?: string) {
            try {
                const data: any = await $fetch(`/api/requests/${id}`, {
                    method: 'PATCH',
                    body: { status, comment }
                })

                if (data && data.success) {
                    await this.fetchRequests()
                    return true
                }
                return false
            } catch (error: any) {
                console.error('Failed to update request:', error)
                throw new Error(error.data?.statusMessage || 'Failed to update request')
            }
        },

        async deleteRequest(id: number) {
            try {
                const data: any = await $fetch(`/api/requests/${id}`, {
                    method: 'DELETE'
                })

                if (data && data.success) {
                    this.requests = this.requests.filter(r => r.id !== id)
                    return true
                }
                return false
            } catch (error: any) {
                console.error('Failed to delete request:', error)
                throw new Error(error.data?.statusMessage || 'Failed to delete request')
            }
        }
    }
})
