// https://nuxt.com/docs/api/configuration/nuxt-config
// Trigger rebuild
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/globals.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/image'
  ],
  i18n: {
    vueI18n: './i18n.config.ts',
    defaultLocale: 'en',
    strategy: 'no_prefix' // Simplifying URL structure
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key-change-me',
    public: {
      apiBase: '/api'
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
