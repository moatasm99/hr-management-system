import { defineStore } from 'pinia'

export const usePenaltiesStore = defineStore('penalties', {
    state: () => ({
        penalties: [] as any[],
        loading: false
    }),
    actions: {
        async fetchPenalties() {
            this.loading = true
            try {
                const { data } = await useFetch('/api/penalties')
                if (data.value) {
                    this.penalties = data.value.penalties
                }
            } catch (e) {
                console.error(e)
            } finally {
                this.loading = false
            }
        },
        async createPenalty(form: any) {
            this.loading = true
            try {
                const { data, error } = await useFetch('/api/penalties', {
                    method: 'POST',
                    body: form
                })
                if (data.value) {
                    await this.fetchPenalties()
                    return true
                }
                return false
            } catch (e) {
                console.error(e)
                return false
            } finally {
                this.loading = false
            }
        }
    }
})
