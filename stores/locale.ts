import { defineStore } from 'pinia'

export const useLocaleStore = defineStore('locale', {
    state: () => ({
        dir: 'ltr' as 'ltr' | 'rtl'
    }),

    actions: {
        initLocale() {
            if (process.client) {
                const { locale } = useNuxtApp().$i18n
                this.updateDirection(locale.value)
            }
        },

        setLocale(newLocale: 'en' | 'ar') {
            const { setLocale } = useNuxtApp().$i18n
            setLocale(newLocale)
            this.updateDirection(newLocale)
            localStorage.setItem('locale', newLocale)
        },

        updateDirection(locale: string) {
            if (locale === 'ar') {
                this.dir = 'rtl'
                document.documentElement.setAttribute('dir', 'rtl')
                document.documentElement.setAttribute('lang', 'ar')
            } else {
                this.dir = 'ltr'
                document.documentElement.setAttribute('dir', 'ltr')
                document.documentElement.setAttribute('lang', 'en')
            }
        }
    }
})
