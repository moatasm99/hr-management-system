import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        theme: 'light' as 'light' | 'dark'
    }),

    actions: {
        initTheme() {
            if (process.client) {
                // Check localStorage or system preference
                const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
                if (storedTheme) {
                    this.theme = storedTheme
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    this.theme = 'dark'
                }

                this.applyTheme()
            }
        },

        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light'
            this.applyTheme()
        },

        setTheme(newTheme: 'light' | 'dark') {
            this.theme = newTheme
            this.applyTheme()
        },

        applyTheme() {
            if (process.client) {
                // Apply data-theme attribute as requested
                document.documentElement.setAttribute('data-theme', this.theme)

                // Also keep the 'dark' class for Tailwind compatibility for now
                // ensuring smooth transition to strictly CSS variables later
                if (this.theme === 'dark') {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }

                localStorage.setItem('theme', this.theme)
            }
        }
    }
})
