export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('auth_token')

  // List of protected routes
  const protectedRoutes = ['/gerenciar']
  const isDashboardRoute = to.path.startsWith('/dashboard')
  const isProtectedRoute = protectedRoutes.includes(to.path) || isDashboardRoute

  // If the user tries to access a protected route without a token, redirect to /login
  if (isProtectedRoute && !token.value) {
    return navigateTo('/login')
  }

  // If the user is logged in and tries to access /login, redirect to home or a specific page
  if (to.path === '/login' && token.value) {
    return navigateTo('/')
  }
})
