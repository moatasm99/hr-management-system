export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) return navigateTo('/auth/login')

    const role = authStore.user?.role

    if (to.path.startsWith('/hr') && role !== 'HR') {
        return navigateTo('/')
    }

    if (to.path.startsWith('/manager') && role !== 'MANAGER' && role !== 'HR') {
        return navigateTo('/')
    }

    // Employees can access their own routes, which are generally open or specific to them.
})
