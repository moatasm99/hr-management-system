<template>
  <div class="flex h-screen bg-[var(--bg-secondary)] font-sans text-[var(--text-primary)]">
    <!-- Sidebar -->
    <aside :class="['bg-[var(--bg-primary)] w-72 flex-shrink-0 border-r border-[var(--border-color)] transition-all duration-300', isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 fixed lg:static z-30 h-full']">
      <div class="h-full flex flex-col p-6">
        <!-- Logo Section -->
        <div class="flex items-center space-x-4 mb-10 px-2 rtl:space-x-reverse">
          <div class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none bg-gradient-to-br from-indigo-500 to-indigo-600">
            <CalendarDaysIcon class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">HR Portal</h1>
            <p class="text-sm text-gray-400 font-medium">Dashboard</p>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto space-y-2">
          <ul class="space-y-4">
            <li v-for="item in navItems" :key="item.to">
              <NuxtLink :to="item.to" 
                class="flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium"
                active-class="bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                :class="$route.path === item.to ? '' : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-gray-700'">
                <component :is="item.icon" 
                  class="w-6 h-6 mr-4 rtl:ml-4 rtl:mr-0 transition-colors"
                  :class="$route.path === item.to ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white'" 
                />
                <span class="text-base">{{ $t(item.label) }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Logout Section -->
        <div class="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
          <button @click="authStore.logout" class="flex items-center w-full px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-xl transition-colors font-medium group">
            <ArrowLeftOnRectangleIcon class="w-6 h-6 mr-4 rtl:ml-4 rtl:mr-0 text-gray-400 group-hover:text-red-500 transition-colors" />
            <span class="text-base">{{ $t('nav.logout') }}</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden relative">
      <!-- Header -->
      <header class="bg-[var(--bg-primary)] shadow-sm h-20 flex items-center justify-between px-8 z-10 border-b border-[var(--border-color)]">
        <button @click="isSidebarOpen = !isSidebarOpen" class="lg:hidden text-gray-500 focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bars3Icon class="w-6 h-6" />
        </button>

        <div class="flex items-center space-x-6 rtl:space-x-reverse ml-auto">
          <!-- Language Switcher -->
          <button @click="toggleLocale" class="flex items-center text-gray-500 hover:text-indigo-600 dark:text-gray-400 transition-colors font-medium">
            <span class="uppercase">{{ localeStore.dir === 'ltr' ? 'Arabic' : 'English' }}</span>
          </button>

          <!-- Dark Mode Toggle -->
          <button @click="toggleDark" class="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-yellow-400 transition-colors bg-gray-50 dark:bg-gray-700 rounded-full">
            <SunIcon v-if="themeStore.theme === 'dark'" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>
          
          <!-- User Profile -->
          <div class="flex items-center pl-6 border-l border-gray-100 dark:border-gray-700 rtl:pl-0 rtl:pr-6 rtl:border-l-0 rtl:border-r">
            <div class="text-right mr-3 rtl:mr-0 rtl:ml-3 hidden sm:block">
              <p class="text-sm font-bold text-gray-900 dark:text-white">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ authStore.user?.role }}</p>
            </div>
            <div class="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200 dark:shadow-none text-lg">
              {{ authStore.user?.name?.charAt(0) }}
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--bg-secondary)] p-8">
        <slot />
      </main>
    </div>
    <SpeedInsights />
  </div>
</template>

<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue'
import { 
  HomeIcon, 
  CalendarDaysIcon, 
  ClipboardDocumentListIcon, 
  ExclamationCircleIcon, 
  CurrencyDollarIcon, 
  SparklesIcon, 
  UsersIcon, 
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
  UserCircleIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()
const isSidebarOpen = ref(false)

// Initialize theme and locale
onMounted(() => {
  themeStore.initTheme()
  localeStore.initLocale()
})

const toggleLocale = () => {
  localeStore.setLocale(localeStore.dir === 'ltr' ? 'ar' : 'en')
}

const toggleDark = () => {
  themeStore.toggleTheme()
}

const navItems = computed(() => {
  const items = [
    { to: '/', label: 'Dashboard', icon: CalendarDaysIcon, roles: ['EMPLOYEE', 'MANAGER', 'HR'] },
    { to: '/requests', label: 'Requests', icon: ClipboardDocumentListIcon, roles: ['EMPLOYEE', 'MANAGER', 'HR'] },
    { to: '/payroll', label: 'Payroll', icon: CurrencyDollarIcon, roles: ['EMPLOYEE', 'MANAGER', 'HR'] },
    // Keeping other functional items but maybe hidden if not in design? 
    // The design only shows a few, but I should probably keep the full functionality available
    // I'll add them with appropriate icons
    { to: '/penalties', label: 'Penalties', icon: ExclamationCircleIcon, roles: ['EMPLOYEE', 'MANAGER', 'HR'] },
  ]

  if (authStore.isHR) {
    items.push({ to: '/hr/employees', label: 'Employees', icon: UsersIcon, roles: ['HR'] })
    items.push({ to: '/settings', label: 'Settings', icon: Cog6ToothIcon, roles: ['HR'] })
  }

  // Profile link (from design)
  // Assuming there is a profile page or just a placeholder for now
  // items.push({ to: '/profile', label: 'Profile', icon: UserCircleIcon, roles: ['EMPLOYEE', 'MANAGER', 'HR'] })

  return items
})
</script>
