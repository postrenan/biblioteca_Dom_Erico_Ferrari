<template>
  <div
    class="d-flex flex-wrap justify-content-between align-items-center mb-4 glass-header p-2 p-md-3 rounded shadow-sm gap-2"
  >
    <!-- LEFT SIDE: Back & Portal -->
    <div class="d-flex align-items-center gap-2">
      <button
        v-if="showBackButton"
        class="btn btn-light btn-sm btn-md-normal shadow-sm d-flex align-items-center gap-2"
        @click="$router.back()"
        title="Voltar Página"
      >
        <i class="bi bi-arrow-left"></i>
        <span class="d-none d-lg-inline">Voltar</span>
      </button>

      <NuxtLink
        to="/"
        class="btn btn-light btn-sm btn-md-normal shadow-sm d-flex align-items-center gap-2"
        title="Voltar ao Portal"
      >
        <i class="bi bi-house-door-fill text-primary"></i>
        <span class="d-none d-lg-inline fw-bold text-primary">Portal</span>
      </NuxtLink>
    </div>

    <!-- RIGHT SIDE: Main Navigation (Icon + Text) -->
    <div class="d-flex align-items-center gap-1 gap-md-3 flex-wrap justify-content-end">
      <NuxtLink
        to="/dashboard/manage-loans"
        class="nav-icon-link"
        active-class="active"
      >
        <div class="icon-box"><i class="bi bi-collection"></i></div>
        <span class="nav-text d-none d-md-block">Empréstimos</span>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/admin/users"
        class="nav-icon-link"
        active-class="active"
      >
        <div class="icon-box"><i class="bi bi-people"></i></div>
        <span class="nav-text d-none d-md-block">Usuários</span>
      </NuxtLink>

      <NuxtLink to="/dashboard/books" class="nav-icon-link" active-class="active">
        <div class="icon-box"><i class="bi bi-book"></i></div>
        <span class="nav-text d-none d-md-block">Livros</span>
      </NuxtLink>

      <NuxtLink
        v-if="user?.role === 'ADMIN' || user?.role === 'LIBRARIAN'"
        to="/dashboard/admin/fines"
        class="nav-icon-link"
        active-class="active"
      >
        <div class="icon-box"><i class="bi bi-currency-dollar"></i></div>
        <span class="nav-text d-none d-md-block">Multas</span>
      </NuxtLink>

      <NuxtLink
        v-if="user?.role === 'ADMIN' || user?.role === 'LIBRARIAN'"
        to="/dashboard/admin/suggestions"
        class="nav-icon-link"
        active-class="active"
      >
        <div class="icon-box"><i class="bi bi-lightbulb"></i></div>
        <span class="nav-text d-none d-md-block">Sugestões</span>
      </NuxtLink>

      <NuxtLink
        v-if="user?.role === 'ADMIN'"
        to="/dashboard/admin/series"
        class="nav-icon-link"
        active-class="active"
      >
        <div class="icon-box"><i class="bi bi-list-check"></i></div>
        <span class="nav-text d-none d-md-block">Séries</span>
      </NuxtLink>

      <NuxtLink
        v-if="user?.role === 'ADMIN' || user?.role === 'LIBRARIAN'"
        to="/dashboard/admin/required-readings"
        class="nav-icon-link"
        active-class="active"
      >
        <div class="icon-box"><i class="bi bi-bookmark-star"></i></div>
        <span class="nav-text d-none d-md-block">Leituras</span>
      </NuxtLink>

      <NuxtLink
        v-if="user?.role === 'ADMIN' || user?.role === 'LIBRARIAN'"
        to="/dashboard/admin/waiting-list"
        class="nav-icon-link"
        active-class="active"
      >
        <div class="icon-box"><i class="bi bi-hourglass-split"></i></div>
        <span class="nav-text d-none d-md-block">Espera</span>
      </NuxtLink>

      <div class="vr mx-1 mx-md-2"></div>

      <button
        class="btn btn-danger shadow-sm ms-1 ms-md-2 rounded-circle p-0 d-flex align-items-center justify-content-center"
        @click="handleLogout"
        title="Sair"
        style="width: 36px; height: 36px"
      >
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "Dashboard",
  },
  showBackButton: {
    type: Boolean,
    default: true,
  },
});

const { logout, user } = useAuth();
const router = useRouter();

const handleLogout = () => {
  logout();
  router.push("/login");
};
</script>

<style scoped>
.glass-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.feature-divider {
  height: 25px;
  align-self: center;
  opacity: 0.3;
}

/* Nav Icon Link Styles */
.nav-icon-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #6c757d;
  transition: all 0.2s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  min-width: 70px;
}

.nav-icon-link:hover {
  background: rgba(var(--bs-primary-rgb), 0.05);
  color: var(--bs-primary);
  transform: translateY(-2px);
}

.nav-icon-link.active {
  color: var(--bs-primary);
  font-weight: bold;
}

.nav-icon-link.active .icon-box {
  background: var(--bs-primary);
  color: white;
  box-shadow: 0 4px 6px rgba(var(--bs-primary-rgb), 0.3);
}

.icon-box {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f8f9fa;
  font-size: 1.1rem;
  margin-bottom: 2px;
  transition: all 0.2s ease;
}

.nav-text {
  font-size: 0.75rem;
  letter-spacing: 0.3px;
}
</style>


